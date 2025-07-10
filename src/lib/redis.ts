// lib/redis.ts

import Redis from 'ioredis';

// This function creates and configures the Redis client.
// It will throw an error if the URL is not set, preventing the app from running with a misconfiguration.
const createRedisInstance = () => {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    throw new Error("REDIS_URL environment variable is not set.");
  }
  
  console.log("Creating new Redis instance...");
  return new Redis(redisUrl);
};

// This pattern ensures that we only create one instance of the Redis client per server instance.
// In a serverless environment, this means one instance per cold start of a function.
declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var redis: Redis | undefined;
}

const redis = global.redis || createRedisInstance();

if (process.env.NODE_ENV !== 'production') {
  global.redis = redis;
}

export default redis;
