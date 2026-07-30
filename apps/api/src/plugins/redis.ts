import { Redis } from "ioredis";
import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

class MemoryRedis {
  private store = new Map<string, string>();

  async connect() {
    return undefined;
  }

  async quit() {
    this.store.clear();
  }

  async set(key: string, value: string) {
    this.store.set(key, value);
    return "OK";
  }

  async get(key: string) {
    return this.store.get(key) ?? null;
  }

  async del(key: string) {
    this.store.delete(key);
    return 1;
  }

  async hset(key: string, values: Record<string, string>) {
    for (const [field, value] of Object.entries(values)) {
      this.store.set(`${key}:${field}`, value);
    }
    return 1;
  }

  async hgetall(key: string) {
    const result: Record<string, string> = {};
    for (const [storedKey, value] of this.store.entries()) {
      if (storedKey.startsWith(`${key}:`)) {
        result[storedKey.slice(key.length + 1)] = value;
      }
    }
    return result;
  }

  async setex(key: string, _seconds: number, value: string) {
    this.store.set(key, value);
    return "OK";
  }
}

declare module "fastify" {
  interface FastifyInstance {
    redis: Redis | MemoryRedis;
  }
}

const redisPlugin: FastifyPluginAsync = async (fastify) => {
  const redisUrl = process.env.REDIS_URL ?? "redis://127.0.0.1:6379";

  let redis: Redis | MemoryRedis;
  let client: Redis | undefined;

  try {
    client = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      retryStrategy: () => null, // Không thử lại liên tục nếu kết nối lỗi
      lazyConnect: true,
    });

    client.on("error", () => {}); // Ngăn node.js văng Unhandled error event

    await client.connect();
    redis = client;
    fastify.log.info("Redis connected");
  } catch (error) {
    if (client) {
      client.disconnect();
    }
    fastify.log.warn({ err: error }, "Redis unavailable, falling back to in-memory store");
    redis = new MemoryRedis();
    await redis.connect();
  }

  fastify.decorate("redis", redis as any);

  fastify.addHook("onClose", async () => {
    await redis.quit();
  });
};

export default fp(redisPlugin, { name: "redis" });
