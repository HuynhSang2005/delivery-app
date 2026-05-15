import { describe, expect, it } from 'bun:test';
import vm from 'node:vm';
import { ObservabilityProvider } from '../../app/observability-provider';

describe('admin observability integration', () => {
  it('logs boot and handles error/rejection events through runtime script wiring', () => {
    const element = ObservabilityProvider();
    const scriptSource = element?.props?.dangerouslySetInnerHTML?.__html;

    expect(typeof scriptSource).toBe('string');

    const infoLogs: string[] = [];
    const errorLogs: string[] = [];
    const listeners = new Map<string, (event: unknown) => void>();

    const context = vm.createContext({
      Date,
      JSON,
      String,
      console: {
        info: (...args: unknown[]) => {
          infoLogs.push(args.map(String).join(' '));
        },
        error: (...args: unknown[]) => {
          errorLogs.push(args.map(String).join(' '));
        },
      },
      globalThis: {
        addEventListener: (eventName: string, handler: (event: unknown) => void) => {
          listeners.set(eventName, handler);
        },
      },
    });

    vm.runInContext(scriptSource, context);

    expect(listeners.has('error')).toBe(true);
    expect(listeners.has('unhandledrejection')).toBe(true);

    const onError = listeners.get('error');
    const onUnhandledRejection = listeners.get('unhandledrejection');

    onError?.({ error: new Error('admin_test_error'), message: 'admin_test_error' });
    onUnhandledRejection?.({ reason: new Error('admin_test_rejection') });

    expect(infoLogs.some((entry) => entry.includes('admin_app_boot'))).toBe(true);
    expect(errorLogs.some((entry) => entry.includes('admin_window_error'))).toBe(true);
    expect(errorLogs.some((entry) => entry.includes('admin_unhandled_rejection'))).toBe(true);
  });
});
