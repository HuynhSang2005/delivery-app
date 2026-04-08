import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';

const API_PORT = process.env.RELEASE_SMOKE_API_PORT ?? '3100';
const API_BASE_URL = `http://127.0.0.1:${API_PORT}`;
const API_START_TIMEOUT_MS = 90_000;

async function waitForHttpReady(url, timeoutMs) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // Keep polling until the process is ready.
    }

    await delay(500);
  }

  throw new Error(`Timed out waiting for ${url}`);
}

async function stopProcess(child) {
  if (child.exitCode !== null) {
    return;
  }

  child.kill('SIGTERM');
  const result = await Promise.race([
    once(child, 'exit').then(() => 'exited'),
    delay(5_000).then(() => 'timeout'),
  ]);

  if (result === 'timeout' && child.exitCode === null) {
    child.kill();
  }
}

function captureConsole(options = {}) {
  const { emitInfo = true, emitError = true } = options;
  const info = [];
  const error = [];
  const originalInfo = console.info;
  const originalError = console.error;

  console.info = (...args) => {
    info.push(args.map(String).join(' '));
    if (emitInfo) {
      originalInfo(...args);
    }
  };

  console.error = (...args) => {
    error.push(args.map(String).join(' '));
    if (emitError) {
      originalError(...args);
    }
  };

  return () => {
    console.info = originalInfo;
    console.error = originalError;
    return { info, error };
  };
}

async function runApiReleaseSmoke() {
  const apiLogs = [];
  const apiServer = spawn('bun', ['run', '--cwd', 'apps/api', 'start:dev'], {
    env: {
      ...process.env,
      API_PORT,
      PORT: API_PORT,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  apiServer.stdout.on('data', (chunk) => {
    apiLogs.push(String(chunk));
  });
  apiServer.stderr.on('data', (chunk) => {
    apiLogs.push(String(chunk));
  });

  try {
    await waitForHttpReady(`${API_BASE_URL}/api/v1/health/live`, API_START_TIMEOUT_MS);

    const happyResponse = await fetch(`${API_BASE_URL}/api/v1/health/live`, {
      headers: {
        'x-request-id': 'release-smoke-api-happy',
      },
    });
    assert.equal(happyResponse.status, 200, 'api happy-path should return 200');

    const unhappyResponse = await fetch(`${API_BASE_URL}/api/v1/health/not-found`, {
      headers: {
        'x-request-id': 'release-smoke-api-unhappy',
      },
    });
    assert.equal(unhappyResponse.status, 404, 'api unhappy-path should return 404');

    await delay(300);

    const combinedLogs = apiLogs.join('');
    assert.ok(
      combinedLogs.includes('release-smoke-api-happy') && combinedLogs.includes('release-smoke-api-unhappy'),
      'api logs should include request ids for both happy and unhappy flows',
    );

    console.log('api release smoke: pass');
  } finally {
    await stopProcess(apiServer);
  }
}

async function runAdminReleaseSmoke() {
  const restoreConsole = captureConsole({ emitError: false });

  try {
    const { reportAdminInfo, reportAdminError } = await import(
      new URL('../../apps/admin-web/lib/observability.ts', import.meta.url).href
    );

    reportAdminInfo('admin_release_smoke_happy', { route: '/' });
    reportAdminError('admin_release_smoke_unhappy', new Error('admin_release_smoke_error'));
  } finally {
    const logs = restoreConsole();
    assert.ok(
      logs.info.some((line) => line.includes('admin_release_smoke_happy')),
      'admin happy-path log should be emitted',
    );
    assert.ok(
      logs.error.some((line) => line.includes('admin_release_smoke_unhappy')),
      'admin unhappy-path log should be emitted',
    );
  }

  console.log('admin release smoke: pass');
}

async function runMobileReleaseSmoke() {
  const restoreConsole = captureConsole({ emitError: false });
  const previousErrorUtils = globalThis.ErrorUtils;

  let installedHandler = () => {};
  globalThis.ErrorUtils = {
    getGlobalHandler: () => installedHandler,
    setGlobalHandler: (handler) => {
      installedHandler = handler;
    },
  };

  try {
    const { attachMobileGlobalErrorHandler, reportMobileInfo } = await import(
      new URL('../../apps/mobile/utils/observability.ts', import.meta.url).href
    );

    const detach = attachMobileGlobalErrorHandler();

    reportMobileInfo('mobile_release_smoke_happy', {
      route: '(tabs)',
    });

    installedHandler(new Error('mobile_release_smoke_error'), true);
    detach();
  } finally {
    if (previousErrorUtils === undefined) {
      delete globalThis.ErrorUtils;
    } else {
      globalThis.ErrorUtils = previousErrorUtils;
    }

    const logs = restoreConsole();
    assert.ok(
      logs.info.some((line) => line.includes('mobile_release_smoke_happy')),
      'mobile happy-path log should be emitted',
    );
    assert.ok(
      logs.error.some((line) => line.includes('mobile_global_error')),
      'mobile unhappy-path log should be emitted',
    );
  }

  console.log('mobile release smoke: pass');
}

async function main() {
  await runApiReleaseSmoke();
  await runAdminReleaseSmoke();
  await runMobileReleaseSmoke();

  console.log('release smoke contracts: pass');
}

try {
  await main();
  process.exit(0);
} catch (error) {
  console.error(`release smoke contracts: fail - ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
