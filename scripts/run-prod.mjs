#!/usr/bin/env node
/**
 * Production runner — builds and starts API, worker, and web locally.
 *
 * Usage:  npm run prod
 *         node scripts/run-prod.mjs [--skip-docker] [--skip-build] [--skip-db]
 */

import { spawn, execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const args = process.argv.slice(2);
const skipDocker = args.includes('--skip-docker');
const skipBuild = args.includes('--skip-build');
const skipDb = args.includes('--skip-db');

const env = {
  ...process.env,
  NODE_ENV: 'production',
};

function run(cmd, cmdArgs = [], opts = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(cmd, cmdArgs, {
      cwd: ROOT,
      env,
      stdio: 'inherit',
      shell: process.platform === 'win32',
      ...opts,
    });
    child.on('exit', (code) => {
      if (code === 0) resolvePromise();
      else reject(new Error(`Command failed (${code}): ${cmd} ${cmdArgs.join(' ')}`));
    });
    child.on('error', reject);
  });
}

function runSync(cmd, cmdArgs = []) {
  execSync(`${cmd} ${cmdArgs.join(' ')}`, {
    cwd: ROOT,
    env,
    stdio: 'inherit',
    shell: true,
  });
}

const children = [];

function startService(name, cmd, cmdArgs) {
  const child = spawn(cmd, cmdArgs, {
    cwd: ROOT,
    env,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  child.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`[${name}] exited with code ${code}`);
    }
  });
  children.push({ name, child });
  return child;
}

function shutdown() {
  console.log('\nShutting down...');
  for (const { name, child } of children) {
    if (!child.killed) {
      console.log(`  stopping ${name}`);
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', String(child.pid), '/f', '/t'], { shell: true });
      } else {
        child.kill('SIGTERM');
      }
    }
  }
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

async function main() {
  console.log('Personal Finance OS — production mode\n');

  if (!existsSync(resolve(ROOT, '.env'))) {
    console.error('Missing .env file. Copy .env.example to .env and fill in your keys.');
    process.exit(1);
  }

  if (!skipDocker) {
    console.log('→ Starting Docker (Postgres + Redis)...');
    await run('docker', ['compose', 'up', '-d']);
  } else {
    console.log('→ Skipping Docker (--skip-docker)');
  }

  if (!skipBuild) {
    console.log('\n→ Building all packages...');
    await run('npm', ['run', 'build']);
  } else {
    console.log('\n→ Skipping build (--skip-build)');
  }

  if (!skipDb) {
    console.log('\n→ Pushing database schema...');
    await run('npm', ['run', 'db:push']);
  } else {
    console.log('\n→ Skipping db:push (--skip-db)');
  }

  console.log('\n→ Starting services...\n');
  console.log('  Web:    http://localhost:3000');
  console.log('  API:    http://localhost:3001');
  console.log('  Swagger http://localhost:3001/docs');
  console.log('  Press Ctrl+C to stop all services\n');

  // API must be up before web in prod (web calls API)
  startService('api', 'npm', ['run', 'start:prod', '-w', '@pf/api']);
  startService('worker', 'npm', ['run', 'start', '-w', '@pf/worker']);

  // Brief pause so API binds before Next.js starts
  await new Promise((r) => setTimeout(r, 2000));

  startService('web', 'npm', ['run', 'start:prod', '-w', '@pf/web']);

  // Keep parent alive while children run
  await new Promise(() => {});
}

main().catch((err) => {
  console.error(err.message);
  shutdown();
});
