import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const [projectRootArg, command, generatedPathArg] = process.argv.slice(2);

if (!projectRootArg || !command || !generatedPathArg) {
  console.error(
    'Usage: node tools/check-generated-idempotent.mjs <project-root> <generate-command> <generated-path>',
  );
  process.exit(2);
}

const workspaceRoot = execSync('git rev-parse --show-toplevel', {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe'],
}).trim();
const projectRoot = path.resolve(workspaceRoot, projectRootArg);
const generatedRoot = path.resolve(projectRoot, generatedPathArg);

function listFiles(directory) {
  if (!existsSync(directory)) {
    return [];
  }

  const entries = readdirSync(directory, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      return listFiles(entryPath);
    }

    if (!entry.isFile()) {
      return [];
    }

    return [entryPath];
  });
}

function snapshotGenerated() {
  const snapshot = new Map();

  for (const filePath of listFiles(generatedRoot)) {
    const relativePath = path.relative(generatedRoot, filePath).replaceAll('\\', '/');
    const hash = createHash('sha256').update(readFileSync(filePath)).digest('hex');
    snapshot.set(relativePath, hash);
  }

  return snapshot;
}

function diffSnapshots(before, after) {
  const allPaths = new Set([...before.keys(), ...after.keys()]);
  return [...allPaths].filter((filePath) => before.get(filePath) !== after.get(filePath)).sort();
}

const before = snapshotGenerated();

execSync(command, {
  cwd: projectRoot,
  stdio: 'inherit',
  shell: true,
});

const after = snapshotGenerated();
const changed = diffSnapshots(before, after);

if (changed.length > 0) {
  console.error('[generated-check] generation is not idempotent. Changed files:');
  for (const filePath of changed) {
    console.error(`- ${filePath}`);
  }
  process.exit(1);
}

console.log('[generated-check] generated artifacts are idempotent.');
