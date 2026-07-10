/**
 * MUSHIN API — Standalone Server Entry Point.
 *
 * Boots the Hono application on Node.js HTTP server.
 * Handles graceful shutdown on SIGTERM/SIGINT.
 */
import { serve } from '@hono/node-server';
import { createApp } from './index.js';
import { createLogger } from '@mushin/shared';

const logger = createLogger('api:server');

async function main() {
  const port = Number(process.env['PORT'] ?? 3000);

  const app = createApp();

  const server = serve({
    fetch: app.fetch,
    port,
  }, (info) => {
    logger.info(`MUSHIN API listening on http://localhost:${info.port}`);
  });

  // ── Graceful Shutdown ──────────────────────────────────────

  let shuttingDown = false;

  async function shutdown(signal: string) {
    if (shuttingDown) return;
    shuttingDown = true;

    logger.info(`Received ${signal}, shutting down gracefully...`);

    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });

    // Force exit after 10s
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10_000);
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

main().catch((err) => {
  logger.error('Failed to start server', err);
  process.exit(1);
});
