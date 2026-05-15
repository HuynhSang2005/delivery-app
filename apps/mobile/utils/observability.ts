type MobileMeta = Record<string, string | number | boolean | null | undefined>;

type GlobalErrorHandler = (error: unknown, isFatal?: boolean) => void;

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

function writeLog(level: 'info' | 'error', event: string, meta?: MobileMeta) {
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

export function reportMobileInfo(event: string, meta?: MobileMeta) {
  writeLog('info', event, meta);
}

export function reportMobileError(event: string, error: unknown, meta?: MobileMeta) {
  writeLog('error', event, {
    ...meta,
    errorMessage: normalizeUnknownError(error),
  });
}

export function attachMobileGlobalErrorHandler(): () => void {
  const errorUtils = (globalThis as {
    ErrorUtils?: {
      getGlobalHandler?: () => GlobalErrorHandler;
      setGlobalHandler?: (handler: GlobalErrorHandler) => void;
    };
  }).ErrorUtils;
  const getGlobalHandler = errorUtils?.getGlobalHandler;
  const setGlobalHandler = errorUtils?.setGlobalHandler;

  if (!getGlobalHandler || !setGlobalHandler) {
    reportMobileInfo('mobile_global_error_handler_skipped', { reason: 'ErrorUtils_not_available' });
    return () => {};
  }

  const previous = getGlobalHandler();
  const nextHandler: GlobalErrorHandler = (error, isFatal) => {
    reportMobileError('mobile_global_error', error, { isFatal: Boolean(isFatal) });
    previous(error, isFatal);
  };

  setGlobalHandler(nextHandler);
  return () => {
    setGlobalHandler(previous);
  };
}
