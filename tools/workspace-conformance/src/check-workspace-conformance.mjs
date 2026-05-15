import { execSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const REQUIRED_SCRIPT_TARGETS = ['build', 'typecheck', 'lint', 'test'];
const CRITICAL_PROJECTS = new Set(['api-client', 'shared-kernel', 'api', 'admin-web', 'mobile']);
const FORBIDDEN_FOUNDATION_PATHS = ['.specify'];
const FORBIDDEN_SKILL_PREFIXES = ['speckit-'];
const ADMIN_WEB_PROJECT = 'admin-web';
const EXPECTED_PROJECT_TAGS = {
  api: ['scope:api', 'type:app', 'platform:server'],
  'admin-web': ['scope:admin', 'type:app', 'platform:web'],
  mobile: ['scope:mobile', 'type:app', 'platform:mobile'],
  'api-client': ['scope:shared', 'type:util', 'platform:shared'],
  'shared-kernel': ['scope:shared', 'type:util', 'platform:shared'],
};
const WORKSPACE_ROOT = execSync('git rev-parse --show-toplevel', {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe'],
}).trim();

function getProjects() {
  const raw = execSync('bunx nx show projects', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  return raw
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getProjectDetails(name) {
  const raw = execSync(`bunx nx show project ${name} --json`, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return JSON.parse(raw);
}

function getProjectScripts(project) {
  const packageJsonPath = path.resolve(WORKSPACE_ROOT, project.root ?? '.', 'package.json');
  if (!existsSync(packageJsonPath)) {
    return { packageJsonPath, scripts: null };
  }

  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  return { packageJsonPath, scripts: packageJson.scripts ?? {} };
}

function isPlaceholderScript(command) {
  if (typeof command !== 'string') {
    return false;
  }

  const normalized = command.trim().toLowerCase();
  if (!normalized) {
    return true;
  }

  return (
    /^echo\b/.test(normalized) ||
    /\bno\s+.+\s+yet\b/.test(normalized) ||
    /\bplaceholder\b/.test(normalized)
  );
}

function isNextDevOrBuildCommand(command) {
  return typeof command === 'string' && /\bnext\s+(dev|build)\b/.test(command);
}

function usesWebpackFallback(command) {
  return isNextDevOrBuildCommand(command) && /(^|\s)--webpack($|\s)/.test(command);
}

function usesExplicitTurbopack(command) {
  return isNextDevOrBuildCommand(command) && /(^|\s)--turbo(pack)?($|\s)/.test(command);
}

function checkNameFormat(name) {
  if (/^[a-z0-9-@/]+$/.test(name)) {
    return [];
  }

  return [`[name-format] Project ${name} should use kebab-case friendly naming.`];
}

function checkRequiredTargets(name, targetNames) {
  if (!CRITICAL_PROJECTS.has(name)) {
    return [];
  }

  const violations = [];
  for (const target of REQUIRED_SCRIPT_TARGETS) {
    if (!targetNames.includes(target)) {
      violations.push(`[required-targets] Project ${name} missing required target: ${target}.`);
    }
  }

  return violations;
}

function checkRequiredScripts(name, project) {
  if (!CRITICAL_PROJECTS.has(name)) {
    return [];
  }

  const { packageJsonPath, scripts } = getProjectScripts(project);
  if (scripts) {
    const violations = [];
    for (const target of REQUIRED_SCRIPT_TARGETS) {
      const command = scripts[target];
      if (typeof command !== 'string') {
        violations.push(`[scripts-missing] Project ${name} missing script "${target}" in ${packageJsonPath}.`);
        continue;
      }

      if (isPlaceholderScript(command)) {
        violations.push(
          `[scripts-placeholder] Project ${name} script "${target}" is placeholder-like in ${packageJsonPath}: ${command}`,
        );
      }
    }

    return violations;
  }

  return [`[scripts-file] Project ${name} missing package.json at ${packageJsonPath}.`];
}

function checkSharedTags(name, tags) {
  const expectedTags = EXPECTED_PROJECT_TAGS[name];
  if (!expectedTags) {
    return [];
  }

  const violations = [];
  for (const requiredTag of expectedTags) {
    if (!tags.includes(requiredTag)) {
      violations.push(`[project-tags] Project ${name} missing tag: ${requiredTag}.`);
    }
  }

  return violations;
}

function checkProjectRoot(name, project) {
  const normalizedRoot = (project.root ?? '').replaceAll('\\', '/');
  if (normalizedRoot.startsWith('.agents/')) {
    return [`[project-root] Project ${name} is under .agents and must not be part of the Nx graph.`];
  }

  return [];
}

function checkAdminWebTurbopackBaseline(name, project) {
  if (name !== ADMIN_WEB_PROJECT) {
    return [];
  }

  const violations = [];
  const { packageJsonPath, scripts } = getProjectScripts(project);
  const nextConfigPath = path.resolve(WORKSPACE_ROOT, project.root ?? '.', 'next.config.ts');

  if (!scripts) {
    return [`[admin-web-turbopack] Project ${name} missing package.json at ${packageJsonPath}.`];
  }

  for (const [scriptName, command] of Object.entries(scripts)) {
    if (usesWebpackFallback(command)) {
      violations.push(
        `[admin-web-turbopack] Script "${scriptName}" must not opt into Webpack; Next.js 16 baseline is Turbopack: ${packageJsonPath}`,
      );
    }

    if (isNextDevOrBuildCommand(command) && !usesExplicitTurbopack(command)) {
      violations.push(
        `[admin-web-turbopack] Script "${scriptName}" must explicitly pass --turbopack for a clear monorepo baseline: ${packageJsonPath}`,
      );
    }
  }

  if (!existsSync(nextConfigPath)) {
    violations.push(`[admin-web-turbopack] Missing Next.js config at ${nextConfigPath}.`);
    return violations;
  }

  const nextConfig = readFileSync(nextConfigPath, 'utf8');
  if (/\bwebpack\s*[:(]/.test(nextConfig)) {
    violations.push(
      `[admin-web-turbopack] next.config.ts must not define a Webpack override without an approved ADR: ${nextConfigPath}`,
    );
  }

  if (!/\bturbopack\s*:/.test(nextConfig) || !/\broot\s*:/.test(nextConfig)) {
    violations.push(
      `[admin-web-turbopack] next.config.ts must keep turbopack.root for monorepo module resolution: ${nextConfigPath}`,
    );
  }

  return violations;
}

function checkProject(name, project) {
  const targetNames = Object.keys(project.targets ?? {});
  const tags = project.tags ?? [];

  return [
    ...checkProjectRoot(name, project),
    ...checkNameFormat(name),
    ...checkRequiredTargets(name, targetNames),
    ...checkRequiredScripts(name, project),
    ...checkSharedTags(name, tags),
    ...checkAdminWebTurbopackBaseline(name, project),
  ];
}

function findNestedLockfiles() {
  const roots = ['apps', 'packages', 'tools'];
  const violations = [];

  for (const root of roots) {
    const rootPath = path.resolve(WORKSPACE_ROOT, root);
    if (!existsSync(rootPath)) {
      continue;
    }

    for (const entry of readdirSync(rootPath, { withFileTypes: true })) {
      if (!entry.isDirectory()) {
        continue;
      }

      const lockfilePath = path.join(rootPath, entry.name, 'bun.lock');
      if (existsSync(lockfilePath)) {
        violations.push(
          `[nested-lockfile] Remove nested Bun lockfile; workspace dependency state belongs to root bun.lock: ${lockfilePath}`,
        );
      }
    }
  }

  return violations;
}

function findForbiddenFoundationArtifacts() {
  const violations = [];

  for (const relativePath of FORBIDDEN_FOUNDATION_PATHS) {
    const artifactPath = path.resolve(WORKSPACE_ROOT, relativePath);
    if (existsSync(artifactPath)) {
      violations.push(`[forbidden-foundation-artifact] Remove over-engineered planning artifact: ${artifactPath}`);
    }
  }

  const skillsPath = path.resolve(WORKSPACE_ROOT, '.agents', 'skills');
  if (existsSync(skillsPath)) {
    for (const entry of readdirSync(skillsPath, { withFileTypes: true })) {
      if (!entry.isDirectory()) {
        continue;
      }

      if (FORBIDDEN_SKILL_PREFIXES.some((prefix) => entry.name.startsWith(prefix))) {
        violations.push(`[forbidden-foundation-skill] Remove disabled planning skill directory: ${entry.name}`);
      }
    }
  }

  return violations;
}

function runSelfTest() {
  const fakeProject = {
    root: '.agents/skills/example',
    targets: {
      build: {},
      lint: {},
      test: {},
    },
    tags: ['scope:shared'],
  };
  const violations = checkProject('shared-kernel', fakeProject);
  if (violations.length < 2) {
    throw new Error('Self-test failed: expected multiple violations for malformed project metadata.');
  }

  if (!isPlaceholderScript('echo "No tests yet"')) {
    throw new Error('Self-test failed: placeholder script detection should flag echo placeholders.');
  }

  if (!usesWebpackFallback('next build --webpack')) {
    throw new Error('Self-test failed: Webpack fallback detection should flag next build --webpack.');
  }

  if (usesExplicitTurbopack('next build')) {
    throw new Error('Self-test failed: explicit Turbopack detection should not treat default-only commands as explicit.');
  }

  const fakeAdminWebProject = {
    root: 'apps/admin-web',
    targets: {
      build: {},
      typecheck: {},
      lint: {},
      test: {},
    },
    tags: ['scope:admin', 'type:app', 'platform:web'],
  };
  const fakeAdminViolations = checkAdminWebTurbopackBaseline(ADMIN_WEB_PROJECT, fakeAdminWebProject);
  if (fakeAdminViolations.some((violation) => violation.includes('--webpack'))) {
    throw new Error('Self-test failed: current admin-web scripts must not opt into Webpack.');
  }

  console.log('[conformance] self-test passed: violation detection is active.');
}

function main() {
  if (process.argv.includes('--self-test')) {
    runSelfTest();
    return;
  }

  const projects = getProjects();
  const violations = [...findNestedLockfiles(), ...findForbiddenFoundationArtifacts()];

  for (const name of projects) {
    const project = getProjectDetails(name);
    violations.push(...checkProject(name, project));
  }

  if (violations.length > 0) {
    console.error('[conformance] violations detected:');
    for (const violation of violations) {
      console.error(`- ${violation}`);
    }
    process.exit(1);
  }

  console.log('[conformance] workspace checks passed.');
}

main();
