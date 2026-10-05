// Retained for callers of the old script; never terminate unrelated processes.
console.error('[cleanup-port] Automatic process termination was removed. Stop the owning server explicitly or choose another port with next dev -p <port>.');
process.exitCode = 1;
