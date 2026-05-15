import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const PORT = 4020;
const BASE_URL = `http://127.0.0.1:${PORT}`;
let server: ReturnType<typeof spawn> | null = null;

async function waitForReady(url: string, timeoutMs: number) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // Keep polling until next start is ready.
    }
    await delay(250);
  }

  throw new Error(`Timed out waiting for ${url}`);
}

beforeAll(async () => {
  server = spawn('bun', ['run', 'start', '--', '-p', String(PORT)], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      NODE_ENV: 'production',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  await waitForReady(BASE_URL, 90_000);
});

afterAll(async () => {
  if (server && server.exitCode === null) {
    server.kill('SIGTERM');
    await delay(300);
    if (server.exitCode === null) {
      server.kill();
    }
  }
});

describe('admin-web runtime e2e', () => {
  it('serves the home page in production mode', async () => {
    const response = await fetch(BASE_URL);
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html).toContain('Delivery Foundation Console');
  });

  it('serves not-found route with a non-2xx status', async () => {
    const response = await fetch(`${BASE_URL}/definitely-missing-page`);
    expect(response.status).toBeGreaterThanOrEqual(400);
  });
});
