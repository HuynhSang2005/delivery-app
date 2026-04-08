import { spawn } from 'node:child_process';

const cleanEnv = { ...process.env };

for (const key of Object.keys(cleanEnv)) {
  if (key.startsWith('NX_') || key.startsWith('TURBO_')) {
    delete cleanEnv[key];
  }
}

cleanEnv.NODE_ENV = 'production';

const child = spawn('bun', ['run', '--cwd', 'apps/admin-web', 'build', '--', '--webpack'], {
  env: cleanEnv,
  stdio: 'inherit',
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
