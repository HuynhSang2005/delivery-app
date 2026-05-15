import { describe, expect, it } from 'bun:test';
import { ObservabilityProvider } from '../../app/observability-provider';

describe('ObservabilityProvider unit', () => {
  it('renders an inline script with expected runtime hooks', () => {
    const element = ObservabilityProvider();
    expect(element?.props?.id).toBe('admin-observability');

    const scriptSource = element?.props?.dangerouslySetInnerHTML?.__html;
    expect(typeof scriptSource).toBe('string');
    expect(scriptSource).toContain("writeLog('info', 'admin_app_boot'");
    expect(scriptSource).toContain("addEventListener('error'");
    expect(scriptSource).toContain("addEventListener('unhandledrejection'");
  });
});
