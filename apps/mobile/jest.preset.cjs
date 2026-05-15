const expoPreset = require('jest-expo/jest-preset');

const setupFiles = Array.isArray(expoPreset.setupFiles) ? expoPreset.setupFiles : [];

module.exports = {
  ...expoPreset,
  // RN 0.83 ships an ESM setup entry that breaks in current Jest runtime path on this workspace.
  // Keep jest-expo defaults, but exclude that single file and rely on our own test setup.
  setupFiles: setupFiles.filter(
    (entry) => !/react-native[\\/]jest[\\/]setup\.js$/i.test(String(entry)),
  ),
};
