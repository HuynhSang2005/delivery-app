export const SHARED_KERNEL_VERSION = '0.0.1';

export type CapabilitySet = {
  readonly user: boolean;
  readonly driver: boolean;
  readonly admin: boolean;
};
