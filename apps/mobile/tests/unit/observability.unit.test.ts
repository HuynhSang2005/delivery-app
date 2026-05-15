import { attachMobileGlobalErrorHandler, reportMobileError, reportMobileInfo } from '../../utils/observability';

afterEach(() => {
  jest.restoreAllMocks();
  delete (globalThis as { ErrorUtils?: unknown }).ErrorUtils;
});

describe('mobile observability unit', () => {
  it('writes info logs as JSON payloads', () => {
    const infoSpy = jest.spyOn(console, 'info').mockImplementation(() => {});
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    reportMobileInfo('mobile_app_boot', { source: 'unit_test', ok: true });

    expect(infoSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy).not.toHaveBeenCalled();

    const firstInfoArg = infoSpy.mock.calls[0]?.[0];
    expect(typeof firstInfoArg).toBe('string');
    const payload = JSON.parse(firstInfoArg as string);
    expect(payload.level).toBe('info');
    expect(payload.event).toBe('mobile_app_boot');
    expect(payload.meta.source).toBe('unit_test');
    expect(payload.meta.ok).toBe(true);
  });

  it('normalizes unknown errors into errorMessage meta field', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    reportMobileError('mobile_global_error', new Error('boom'), { isFatal: true });

    expect(errorSpy).toHaveBeenCalledTimes(1);
    const firstErrorArg = errorSpy.mock.calls[0]?.[0];
    expect(typeof firstErrorArg).toBe('string');
    const payload = JSON.parse(firstErrorArg as string);
    expect(payload.level).toBe('error');
    expect(payload.event).toBe('mobile_global_error');
    expect(payload.meta.errorMessage).toBe('boom');
    expect(payload.meta.isFatal).toBe(true);
  });

  it('hooks and restores global error handler when ErrorUtils is available', () => {
    const setGlobalHandlerSpy = jest.fn();
    const previousHandler = jest.fn();

    (globalThis as { ErrorUtils?: unknown }).ErrorUtils = {
      getGlobalHandler: () => previousHandler,
      setGlobalHandler: setGlobalHandlerSpy,
    };

    const cleanup = attachMobileGlobalErrorHandler();

    expect(setGlobalHandlerSpy).toHaveBeenCalledTimes(1);
    expect(typeof setGlobalHandlerSpy.mock.calls[0]?.[0]).toBe('function');

    cleanup();

    expect(setGlobalHandlerSpy).toHaveBeenCalledTimes(2);
    expect(setGlobalHandlerSpy.mock.calls[1]?.[0]).toBe(previousHandler);
  });
});
