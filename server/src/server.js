import app from './app.js';
import { env } from './config/env.js';

const server = app.listen(env.port, () => {
  console.log(`[server] API listening on port ${env.port} (${env.nodeEnv})`);
  console.log(`[server] CORS allowed origins: ${env.clientOrigins.join(', ') || '(none)'}`);
});

const shutdown = (signal) => {
  console.log(`[server] ${signal} received, closing connections...`);
  server.close(() => process.exit(0));
  // Force exit if connections do not close in time.
  setTimeout(() => process.exit(1), 10_000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  console.error('[server] Unhandled promise rejection:', reason);
});
