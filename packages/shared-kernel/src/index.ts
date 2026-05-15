export const SHARED_KERNEL_VERSION = '0.0.1';

export const DELIVERY_MVP_SEQUENCE = ['MVP-1', 'MVP-2', 'MVP-3'] as const;

export type DeliveryMvp = (typeof DELIVERY_MVP_SEQUENCE)[number];

export type FoundationCapability = {
  readonly key: 'api' | 'admin-web' | 'mobile' | 'api-client' | 'shared-kernel';
  readonly label: string;
  readonly owner: 'backend' | 'frontend' | 'mobile' | 'shared-platform';
};

export const FOUNDATION_CAPABILITIES = [
  { key: 'api', label: 'Backend health and HTTP contracts', owner: 'backend' },
  { key: 'admin-web', label: 'Admin runtime shell', owner: 'frontend' },
  { key: 'mobile', label: 'Mobile runtime shell', owner: 'mobile' },
  { key: 'api-client', label: 'Generated API client', owner: 'shared-platform' },
  { key: 'shared-kernel', label: 'Shared MVP and foundation constants', owner: 'shared-platform' },
] as const satisfies readonly FoundationCapability[];

export type FoundationStatus = {
  readonly status: 'ok';
  readonly version: typeof SHARED_KERNEL_VERSION;
  readonly mvpSequence: readonly DeliveryMvp[];
  readonly capabilities: readonly FoundationCapability[];
};

export function createFoundationStatus(): FoundationStatus {
  return {
    status: 'ok',
    version: SHARED_KERNEL_VERSION,
    mvpSequence: DELIVERY_MVP_SEQUENCE,
    capabilities: FOUNDATION_CAPABILITIES,
  };
}
