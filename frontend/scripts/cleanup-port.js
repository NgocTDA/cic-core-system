import { execSync } from 'child_process';
import process from 'process';

try {
  const port = 8700;
  console.log(`[cleanup-port] Checking port ${port}...`);
  if (process.platform === 'win32') {
    try {
      const stdout = execSync(`netstat -ano | findstr :${port}`).toString().trim();
      const lines = stdout.split('\n');
      const pids = new Set();
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 5) {
          const pid = parts[parts.length - 1];
          if (pid && pid !== '0' && !isNaN(Number(pid))) {
            pids.add(pid);
          }
        }
      }
      for (const pid of pids) {
        console.log(`[cleanup-port] Killing process ${pid} on Windows...`);
        try {
          execSync(`taskkill /F /PID ${pid}`);
        } catch (err) {
          console.error(`[cleanup-port] Failed to kill process ${pid}:`, err.message);
        }
      }
    } catch (e) {
      // netstat exits with 1 if no matches are found, which is caught here
    }
  } else {
    try {
      const stdout = execSync(`lsof -t -i:${port}`).toString().trim();
      const pids = stdout.split('\n').filter(Boolean);
      for (const rawPid of pids) {
        const pid = rawPid.trim().split(/\s+/)[0];
        if (pid && pid !== '0' && !isNaN(Number(pid))) {
          console.log(`[cleanup-port] Killing process ${pid} on macOS/Linux...`);
          execSync(`kill -9 ${pid}`);
        }
      }
    } catch (err) {
      // lsof exits with 1 if no process found
    }
  }
  console.log(`[cleanup-port] Port ${port} is clear.`);
} catch (error) {
  console.log('[cleanup-port] Port 8700 is already free or no process was found.');
}
