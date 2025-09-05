import Redis from "ioredis";
import logger from "./logger";

const ttlDefault = 600; // 10 minutes
let redis: Redis;

export function initializeCache(): Promise<boolean> {
  return new Promise((resolve) => {
    redis = new Redis({
      host: process.env.REDIS_HOST || "hotels-redis",
      port: Number(process.env.REDIS_PORT) || 6379,
      maxRetriesPerRequest: 3,
    });

    redis.on("connect", () => {
      logger.info("Connected to Redis");
      resolve(true);
    });

    redis.on("error", (err: NodeJS.ErrnoException) => {
      logger.error({ err }, "Redis connection error");
      if (err.code === "ECONNREFUSED") {
        logger.fatal("Failed to connect to Redis. Make sure Redis is running.");
        process.exit(1);
      }
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      logger.info("Shutting down Redis connection...");
      try {
        await redis.quit();
        logger.info("Redis connection closed");
      } catch (err) {
        logger.error({ err }, "Error closing Redis connection");
      }
      process.exit(0);
    });
  });
}

export const cache = {
  async get<T>(key: string): Promise<T | undefined> {
    try {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : undefined;
    } catch (err) {
      logger.error({ err }, "Error fetching data from Redis");
      throw err;
    }
  },

  async set<T>(key: string, value: T, ttl = ttlDefault): Promise<void> {
    try {
      await redis.set(key, JSON.stringify(value), "EX", ttl);
    } catch (err) {
      logger.error({ err }, "Error setting data in Redis");
      throw err;
    }
  },

  async del(key: string): Promise<void> {
    await redis.del(key);
  },
};
