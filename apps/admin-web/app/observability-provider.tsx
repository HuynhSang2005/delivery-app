export function ObservabilityProvider() {
  return (
    <script
      id="admin-observability"
      dangerouslySetInnerHTML={{
        __html: `(function () {
  const writeLog = (level, event, meta = {}) => {
    const payload = {
      ts: new Date().toISOString(),
      level,
      event,
      meta,
    };

    const serialized = JSON.stringify(payload);
    if (level === 'error') {
      console.error(serialized);
      return;
    }
    console.info(serialized);
  };

  writeLog('info', 'admin_app_boot', { runtime: 'browser' });

  globalThis.addEventListener('error', (event) => {
    const errorValue = event.error ?? event.message;
    writeLog('error', 'admin_window_error', {
      errorMessage: typeof errorValue === 'string' ? errorValue : String(errorValue),
    });
  });

  globalThis.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    writeLog('error', 'admin_unhandled_rejection', {
      errorMessage: typeof reason === 'string' ? reason : String(reason),
    });
  });
})();`,
      }}
    />
  );
}
