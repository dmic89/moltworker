import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mountR2Storage } from './r2';
import type { Sandbox } from '@cloudflare/sandbox';
import type { ClawdbotEnv } from '../types';

// Helper to create a minimal env object
function createEnv(overrides: Partial<ClawdbotEnv> = {}): ClawdbotEnv {
  return {
    Sandbox: {} as any,
    ASSETS: {} as any,
    CLAWDBOT_BUCKET: {} as any,
    ...overrides,
  };
}

// Helper to create a mock process
function createMockProcess(stdout: string = '', exitCode: number = 0) {
  return {
    status: 'completed',
    exitCode,
    getLogs: vi.fn().mockResolvedValue({ stdout, stderr: '' }),
  };
}

// Helper to create a mock sandbox
function createMockSandbox(options: { mounted?: boolean } = {}): { 
  sandbox: Sandbox; 
  mountBucketMock: ReturnType<typeof vi.fn>;
  startProcessMock: ReturnType<typeof vi.fn>;
} {
  const mountBucketMock = vi.fn().mockResolvedValue(undefined);
  
  // Default: return empty stdout (not mounted), unless mounted: true
  const startProcessMock = vi.fn().mockResolvedValue(
    options.mounted 
      ? createMockProcess('s3fs on /data/clawdbot type fuse.s3fs (rw,nosuid,nodev,relatime,user_id=0,group_id=0)\n')
      : createMockProcess('')
  );
  
  const sandbox = {
    mountBucket: mountBucketMock,
    listProcesses: vi.fn(),
    startProcess: startProcessMock,
    containerFetch: vi.fn(),
    wsConnect: vi.fn(),
  } as unknown as Sandbox;

  return { sandbox, mountBucketMock, startProcessMock };
}

describe('mountR2Storage', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('returns false when R2_ACCESS_KEY_ID is missing', async () => {
    const { sandbox } = createMockSandbox();
    const env = createEnv({
      R2_SECRET_ACCESS_KEY: 'secret',
      CF_ACCOUNT_ID: 'account123',
    });

    const result = await mountR2Storage(sandbox, env);

    expect(result).toBe(false);
  });

  it('returns false when R2_SECRET_ACCESS_KEY is missing', async () => {
    const { sandbox } = createMockSandbox();
    const env = createEnv({
      R2_ACCESS_KEY_ID: 'key123',
      CF_ACCOUNT_ID: 'account123',
    });

    const result = await mountR2Storage(sandbox, env);

    expect(result).toBe(false);
  });

  it('returns false when CF_ACCOUNT_ID is missing', async () => {
    const { sandbox } = createMockSandbox();
    const env = createEnv({
      R2_ACCESS_KEY_ID: 'key123',
      R2_SECRET_ACCESS_KEY: 'secret',
    });

    const result = await mountR2Storage(sandbox, env);

    expect(result).toBe(false);
  });

  it('returns false when all R2 credentials are missing', async () => {
    const { sandbox } = createMockSandbox();
    const env = createEnv();

    const result = await mountR2Storage(sandbox, env);

    expect(result).toBe(false);
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('R2 storage not configured')
    );
  });

  it('mounts R2 bucket when all credentials are provided and not already mounted', async () => {
    const { sandbox, mountBucketMock } = createMockSandbox({ mounted: false });
    const env = createEnv({
      R2_ACCESS_KEY_ID: 'key123',
      R2_SECRET_ACCESS_KEY: 'secret',
      CF_ACCOUNT_ID: 'account123',
    });

    const result = await mountR2Storage(sandbox, env);

    expect(result).toBe(true);
    expect(mountBucketMock).toHaveBeenCalledWith(
      'clawdbot-data',
      '/data/clawdbot',
      {
        endpoint: 'https://account123.r2.cloudflarestorage.com',
        credentials: {
          accessKeyId: 'key123',
          secretAccessKey: 'secret',
        },
      }
    );
  });

  it('returns false when mountBucket throws an error and mount check fails', async () => {
    const { sandbox, mountBucketMock, startProcessMock } = createMockSandbox({ mounted: false });
    mountBucketMock.mockRejectedValue(new Error('Mount failed'));
    // After mount error, check if mounted - return false
    startProcessMock
      .mockResolvedValueOnce(createMockProcess('')) // first check: not mounted
      .mockResolvedValueOnce(createMockProcess('')); // check after error: still not mounted
    
    const env = createEnv({
      R2_ACCESS_KEY_ID: 'key123',
      R2_SECRET_ACCESS_KEY: 'secret',
      CF_ACCOUNT_ID: 'account123',
    });

    const result = await mountR2Storage(sandbox, env);

    expect(result).toBe(false);
    expect(console.error).toHaveBeenCalledWith(
      'Failed to mount R2 bucket:',
      expect.any(Error)
    );
  });

  it('returns true immediately when bucket is already mounted', async () => {
    const { sandbox, mountBucketMock } = createMockSandbox({ mounted: true });
    
    const env = createEnv({
      R2_ACCESS_KEY_ID: 'key123',
      R2_SECRET_ACCESS_KEY: 'secret',
      CF_ACCOUNT_ID: 'account123',
    });

    const result = await mountR2Storage(sandbox, env);

    expect(result).toBe(true);
    // Should not try to mount since already mounted
    expect(mountBucketMock).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(
      'R2 bucket already mounted at',
      '/data/clawdbot'
    );
  });

  it('logs success message when mounted successfully', async () => {
    const { sandbox } = createMockSandbox({ mounted: false });
    const env = createEnv({
      R2_ACCESS_KEY_ID: 'key123',
      R2_SECRET_ACCESS_KEY: 'secret',
      CF_ACCOUNT_ID: 'account123',
    });

    await mountR2Storage(sandbox, env);

    expect(console.log).toHaveBeenCalledWith(
      'R2 bucket mounted successfully - clawdbot data will persist across sessions'
    );
  });

  it('returns true if mount fails but check shows it is actually mounted', async () => {
    const { sandbox, mountBucketMock, startProcessMock } = createMockSandbox();
    
    // First check: not mounted
    // Mount throws an error
    // Second check: actually is mounted (race condition resolved)
    startProcessMock
      .mockResolvedValueOnce(createMockProcess('')) // first check: not mounted
      .mockResolvedValueOnce(createMockProcess('s3fs on /data/clawdbot type fuse.s3fs\n')); // check after error: mounted!
    
    mountBucketMock.mockRejectedValue(new Error('Some transient error'));
    
    const env = createEnv({
      R2_ACCESS_KEY_ID: 'key123',
      R2_SECRET_ACCESS_KEY: 'secret',
      CF_ACCOUNT_ID: 'account123',
    });

    const result = await mountR2Storage(sandbox, env);

    expect(result).toBe(true);
    expect(console.log).toHaveBeenCalledWith('R2 bucket is mounted despite error');
  });
});
