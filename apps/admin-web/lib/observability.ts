type ObservabilityMeta = Record<string, string | number | boolean | null | undefined>;

function normalizeUnknownError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return 'unknown_error';
  }
}

function writeLog(level: 'info' | 'error', event: string, meta?: ObservabilityMeta) {
  const payload = {
    ts: new Date().toISOString(),
    level,
    event,
    meta: meta ?? {},
  };

  const serialized = JSON.stringify(payload);
  if (level === 'error') {
    console.error(serialized);
    return;
  }
  console.info(serialized);
}

export function reportAdminInfo(event: string, meta?: ObservabilityMeta) {
  writeLog('info', event, meta);
}

export function reportAdminError(event: string, error: unknown, meta?: ObservabilityMeta) {
  writeLog('error', event, {
    ...meta,
    errorMessage: normalizeUnknownError(error),
  });
}
