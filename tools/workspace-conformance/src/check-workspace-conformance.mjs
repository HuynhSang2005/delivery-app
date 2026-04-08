import { execSync } from 'node:child_process';

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

function checkProject(name, project) {
  const violations = [];
  const targetNames = Object.keys(project.targets ?? {});

  if (!/^[a-z0-9-@/]+$/.test(name)) {
    violations.push(`[name-format] Project ${name} should use kebab-case friendly naming.`);
  }

  if (name === 'api-client' || name === 'shared-kernel' || name === 'api' || name === 'admin-web' || name === 'mobile') {
    for (const target of ['build', 'typecheck', 'lint', 'test']) {
      if (!targetNames.includes(target)) {
        violations.push(`[required-targets] Project ${name} missing required target: ${target}.`);
      }
    }
  }

  if (name === 'api-client' || name === 'shared-kernel') {
    const tags = project.tags ?? [];
    for (const requiredTag of ['scope:shared', 'type:util', 'platform:shared']) {
      if (!tags.includes(requiredTag)) {
        violations.push(`[shared-tags] Project ${name} missing tag: ${requiredTag}.`);
      }
    }
  }

  return violations;
}

function runSelfTest() {
  const fakeProject = {
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
  console.log('[conformance] self-test passed: violation detection is active.');
}

function main() {
  if (process.argv.includes('--self-test')) {
    runSelfTest();
    return;
  }

  const projects = getProjects();
  const violations = [];

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
