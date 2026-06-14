import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const nextDir = path.join(__dirname, '..', '.next');

console.log('[clean-cache] Cleaning .next cache folder...');
try {
  if (fs.existsSync(nextDir)) {
    fs.rmSync(nextDir, { recursive: true, force: true });
    console.log('[clean-cache] Successfully cleaned .next cache.');
  } else {
    console.log('[clean-cache] .next cache folder does not exist, skipping.');
  }
} catch (error) {
  console.error('[clean-cache] Failed to clean .next cache:', error.message);
}
