/**
 * Keep-Alive Worker for Moltbot Sandbox
 * Pings the container every 5 minutes to prevent Cloudflare from pausing it
 */

const SANDBOX_URL = 'https://moltbot-sandbox.dm-projects.workers.dev/_admin/';

export default {
  // Cron trigger - runs every 5 minutes
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(SANDBOX_URL, {
        method: 'GET',
        headers: {
          'X-Keep-Alive': 'true',
          'User-Agent': 'KeepAlive-Worker/1.0',
        },
      });
      
      const duration = Date.now() - startTime;
      console.log(`[KeepAlive] Ping successful: ${response.status} (${duration}ms)`);
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[KeepAlive] Ping failed after ${duration}ms:`, error);
    }
  },

  // Optional: Manual trigger via HTTP for testing
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    
    if (url.pathname === '/ping') {
      try {
        const response = await fetch(SANDBOX_URL, {
          headers: { 'X-Keep-Alive': 'manual' },
        });
        return new Response(`Ping sent! Status: ${response.status}`, { status: 200 });
      } catch (error) {
        return new Response(`Ping failed: ${error}`, { status: 500 });
      }
    }
    
    return new Response('KeepAlive Worker\n\nGET /ping - Manual ping trigger', { status: 200 });
  },
};

interface Env {}
