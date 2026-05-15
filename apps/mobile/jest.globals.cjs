globalThis.__DEV__ = true;

if (!globalThis.__fbBatchedBridgeConfig) {
  globalThis.__fbBatchedBridgeConfig = {
    remoteModuleConfig: [],
    localModulesConfig: [],
  };
}
