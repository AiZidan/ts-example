import { startServer } from './app';
import { logger } from './utils/logger';

const PORT = parseInt(process.env.PORT || '3000', 10);

logger.info('Starting TypeScript example server...', {
  nodeVersion: process.version,
  platform: process.platform,
  port: PORT,
});

startServer(PORT);