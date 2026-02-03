# Keep-Alive Worker

Cloudflare Worker that pings the Moltbot Sandbox every 5 minutes to prevent container sleep.

## Why?

Cloudflare Containers can get paused when idle. This worker sends a ping every 5 minutes to keep it awake.

## Setup

```bash
bun install
npx wrangler deploy
```

## Configuration

Edit `src/index.ts` to change the target URL:

```ts
const SANDBOX_URL = 'https://moltbot-sandbox.dm-projects.workers.dev/_admin/';
```

## Manual Ping

After deployment, visit `https://keepalive-worker.<your-subdomain>.workers.dev/ping` to trigger a manual ping.
