import app from "./server";
import logger from "./infrastructure/logger";
import fetchAndCacheHotels from "./cron/ingestHotels";
import { initializeCache } from "./infrastructure/cache";

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    // Initialize Redis connection
    logger.info('Initializing Redis connection...');
    const redisInitialized = await initializeCache();
    if (!redisInitialized) {
      logger.error('Failed to initialize Redis. Exiting...');
      process.exit(1);
    }

    // Start the server
    app.listen(port, () => {
      logger.info(`Server running on http://localhost:${port}`);
      
      // Initial data load
      fetchAndCacheHotels().catch(err => {
        logger.error({ err }, 'Failed during initial data load');
      });
    });
  } catch (err) {
    logger.fatal({ err }, 'Failed to start server');
    process.exit(1);
  }
}

// Start the application
startServer();
