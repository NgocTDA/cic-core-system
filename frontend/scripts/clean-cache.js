import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const nextDir = path.join(__dirname, '..', '.next');

if (!process.argv.includes('--confirm')) {
  console.error('[clean-cache] Stop the dev/build server first, then run npm run clean:cache.');
  process.exit(1);
}
const projectDir = fs.realpathSync(path.resolve(__dirname, '..'));
if (path.dirname(path.resolve(nextDir)) !== projectDir ||
    (fs.existsSync(nextDir) && (fs.lstatSync(nextDir).isSymbolicLink() || fs.realpathSync(nextDir) !== path.join(projectDir, '.next')))) {
  throw new Error('Refusing to delete cache outside the frontend project.');
}
console.log('[clean-cache] Cleaning .next cache folder (server must be stopped)...');
try {
  if (fs.existsSync(nextDir)) {
    fs.rmSync(nextDir, { recursive: true, force: true });
    console.log('[clean-cache] Successfully cleaned .next cache.');
  } else {
    console.log('[clean-cache] .next cache folder does not exist, skipping.');
  }
} catch (error) {
  console.error('[clean-cache] Failed to clean .next cache:', error.message);
  process.exitCode = 1;
}
