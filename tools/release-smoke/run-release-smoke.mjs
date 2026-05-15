import assert from 'node:assert/strict';
import { execSync, spawn } from 'node:child_process';
import { once } from 'node:events';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const API_PORT =
  process.env.RELEASE_SMOKE_API_PORT ?? String(4300 + Math.floor(Math.random() * 500));
const API_BASE_URL = `http://127.0.0.1:${API_PORT}`;
const API_START_TIMEOUT_MS = 150_000;
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const RELEASE_SMOKE_MANAGE_DB = process.env.RELEASE_SMOKE_MANAGE_DB !== 'false';

function readRepoFile(relativePath) {
  return readFileSync(path.resolve(REPO_ROOT, relativePath), 'utf8');
}

function hasJsonField(logText, key, value) {
  const raw = `"${key}":"${value}"`;
  const escaped = String.raw`\"${key}\":\"${value}\"`;
  return logText.includes(raw) || logText.includes(escaped);
}

function hasJsonNumberField(logText, key, value) {
  const raw = `"${key}":${value}`;
  const escaped = String.raw`\"${key}\":${value}`;
  return logText.includes(raw) || logText.includes(escaped);
}

function runWorkspaceCommand(command, args) {
  execSync([command, ...args].join(' '), {
    cwd: REPO_ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
    encoding: 'utf8',
  });
}

function tryWorkspaceCommand(command, args) {
  try {
    runWorkspaceCommand(command, args);
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[release-smoke] optional command failed (${command} ${args.join(' ')}): ${message}`);
    return false;
  }
}

function runRequiredWorkspaceCommand(command, args, failureHint) {
  try {
    runWorkspaceCommand(command, args);
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`${failureHint}: ${command} ${args.join(' ')} failed: ${message}`);
  }
}

function assertApiLogEvidence(logText, { requestId, path: requestPath, statusCode }) {
  assert.ok(hasJsonField(logText, 'requestId', requestId), `api logs should include request id ${requestId}`);
  assert.ok(hasJsonField(logText, 'path', requestPath), `api logs should include path ${requestPath}`);
  assert.ok(
    hasJsonNumberField(logText, 'statusCode', statusCode),
    `api logs should include statusCode ${statusCode}`,
  );
}

function assertLayoutWiring() {
  const adminLayoutSource = readRepoFile('apps/admin-web/app/layout.tsx');
  assert.ok(
    adminLayoutSource.includes("import { ObservabilityProvider } from \"./observability-provider\";") &&
      adminLayoutSource.includes('<ObservabilityProvider />'),
    'admin layout must wire ObservabilityProvider in runtime tree',
  );

  const mobileLayoutSource = readRepoFile('apps/mobile/app/_layout.tsx');
  assert.ok(
    mobileLayoutSource.includes("reportMobileInfo('mobile_app_boot'") &&
      mobileLayoutSource.includes('return attachMobileGlobalErrorHandler();'),
    'mobile layout must wire boot logging and global error handler via useEffect',
  );
}

function executeAdminObservabilityScript(scriptSource) {
  const info = [];
  const error = [];
  const listeners = new Map();

  const fakeConsole = {
    info: (...args) => {
      info.push(args.map(String).join(' '));
    },
    error: (...args) => {
      error.push(args.map(String).join(' '));
    },
  };

  const fakeGlobalThis = {
    addEventListener: (eventName, handler) => {
      listeners.set(eventName, handler);
    },
  };

  const context = vm.createContext({
    console: fakeConsole,
    Date,
    JSON,
    String,
    globalThis: fakeGlobalThis,
  });

  vm.runInContext(scriptSource, context);

  assert.ok(listeners.has('error'), 'admin script must register window error listener');
  assert.ok(listeners.has('unhandledrejection'), 'admin script must register unhandledrejection listener');

  const onError = listeners.get('error');
  const onRejection = listeners.get('unhandledrejection');
  onError({ error: new Error('admin_release_smoke_error'), message: 'admin_release_smoke_error' });
  onRejection({ reason: new Error('admin_release_smoke_rejection') });

  return { info, error };
}

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
  let managedDbStarted = false;

  if (RELEASE_SMOKE_MANAGE_DB) {
    managedDbStarted = runRequiredWorkspaceCommand(
      'bun',
      ['run', 'db:up'],
      'release-smoke requires DB bootstrap by default; start Docker or set RELEASE_SMOKE_MANAGE_DB=false only when a pre-existing DB is already verified',
    );
  }

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
    try {
      await waitForHttpReady(`${API_BASE_URL}/api/v1/health/live`, API_START_TIMEOUT_MS);
    } catch (error) {
      const tail = apiLogs
        .join('')
        .split(/\r?\n/)
        .filter(Boolean)
        .slice(-20)
        .join('\n');

      const dbHint = RELEASE_SMOKE_MANAGE_DB
        ? 'release-smoke DB bootstrap succeeded before API startup'
        : 'release-smoke DB bootstrap was intentionally skipped; pre-existing DB is caller-owned';

      throw new Error(
        `api runtime not ready: ${error instanceof Error ? error.message : String(error)} | ${dbHint} | api log tail: ${tail || 'no api logs captured'}`,
      );
    }

    const happyResponse = await fetch(`${API_BASE_URL}/api/v1/health/live`, {
      headers: {
        'x-request-id': 'release-smoke-api-happy',
      },
    });
    assert.equal(happyResponse.status, 200, 'api happy-path should return 200');

    const readyResponse = await fetch(`${API_BASE_URL}/api/v1/health/ready`, {
      headers: {
        'x-request-id': 'release-smoke-api-ready',
      },
    });
    assert.equal(readyResponse.status, 200, 'api readiness-path should return 200');

    const unhappyResponse = await fetch(`${API_BASE_URL}/api/v1/health/not-found`, {
      headers: {
        'x-request-id': 'release-smoke-api-unhappy',
      },
    });
    assert.equal(unhappyResponse.status, 404, 'api unhappy-path should return 404');

    await delay(300);

    const combinedLogs = apiLogs.join('');
    assertApiLogEvidence(combinedLogs, {
      requestId: 'release-smoke-api-happy',
      path: '/api/v1/health/live',
      statusCode: 200,
    });
    assertApiLogEvidence(combinedLogs, {
      requestId: 'release-smoke-api-ready',
      path: '/api/v1/health/ready',
      statusCode: 200,
    });
    assertApiLogEvidence(combinedLogs, {
      requestId: 'release-smoke-api-unhappy',
      path: '/api/v1/health/not-found',
      statusCode: 404,
    });

    console.log('api release smoke: pass');
  } finally {
    await stopProcess(apiServer);
    if (RELEASE_SMOKE_MANAGE_DB && managedDbStarted) {
      tryWorkspaceCommand('bun', ['run', 'db:down']);
    }
  }
}

async function runAdminReleaseSmoke() {
  const { ObservabilityProvider } = await import(
    new URL('../../apps/admin-web/app/observability-provider.tsx', import.meta.url).href
  );

  const element = ObservabilityProvider();
  assert.equal(element?.props?.id, 'admin-observability', 'admin runtime script id must stay stable');

  const scriptSource = element?.props?.dangerouslySetInnerHTML?.__html;
  assert.equal(typeof scriptSource, 'string', 'admin runtime script must be inlined via dangerouslySetInnerHTML');

  const logs = executeAdminObservabilityScript(scriptSource);
  assert.ok(
    logs.info.some((line) => line.includes('admin_app_boot')),
    'admin runtime script should emit boot log',
  );
  assert.ok(
    logs.error.some((line) => line.includes('admin_window_error')),
    'admin runtime script should emit window error log',
  );
  assert.ok(
    logs.error.some((line) => line.includes('admin_unhandled_rejection')),
    'admin runtime script should emit unhandled rejection log',
  );

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

    const previousHandler = installedHandler;
    const detach = attachMobileGlobalErrorHandler();
    assert.notEqual(installedHandler, previousHandler, 'mobile global handler should be replaced on attach');

    reportMobileInfo('mobile_release_smoke_happy', {
      route: '(tabs)',
    });

    installedHandler(new Error('mobile_release_smoke_error'), true);
    detach();
    assert.equal(installedHandler, previousHandler, 'mobile global handler should be restored on detach');
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
  assertLayoutWiring();
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
