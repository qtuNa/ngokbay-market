// apps/api/src/plugins/redis.ts
import { Redis } from 'ioredis';
import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

// TTL tính bằng milliseconds
interface TimedEntry {
  value: string;
  expiresAt: number | null; // null = no expiry
}

/**
 * In-memory Redis fallback dùng khi không kết nối được Redis thực.
 * Implement đầy đủ các method cần thiết cho codebase (set, get, del,
 * setex, ttl, hset, hgetall, del, multi pipeline).
 *
 * ⚠️  Chỉ dùng cho dev/test — không persistent và không distributed.
 */
class MemoryRedis {
  private store = new Map<string, TimedEntry>();

  private isExpired(entry: TimedEntry): boolean {
    return entry.expiresAt !== null && Date.now() > entry.expiresAt;
  }

  private getEntry(key: string): TimedEntry | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (this.isExpired(entry)) {
      this.store.delete(key);
      return undefined;
    }
    return entry;
  }

  async connect() {
    return undefined;
  }

  async quit() {
    this.store.clear();
  }

  /** SET key value */
  async set(key: string, value: string): Promise<'OK'> {
    this.store.set(key, { value, expiresAt: null });
    return 'OK';
  }

  /** SET key value EX seconds */
  async setex(key: string, seconds: number, value: string): Promise<'OK'> {
    this.store.set(key, { value, expiresAt: Date.now() + seconds * 1000 });
    return 'OK';
  }

  /** GET key */
  async get(key: string): Promise<string | null> {
    return this.getEntry(key)?.value ?? null;
  }

  /** DEL key [key ...] — hỗ trợ nhiều key */
  async del(...keys: string[]): Promise<number> {
    let count = 0;
    for (const key of keys) {
      if (this.store.delete(key)) count++;
    }
    return count;
  }

  /** TTL key — trả về giây còn lại, -1 nếu không có TTL, -2 nếu key không tồn tại */
  async ttl(key: string): Promise<number> {
    const entry = this.store.get(key);
    if (!entry || this.isExpired(entry)) return -2;
    if (entry.expiresAt === null) return -1;
    return Math.max(0, Math.ceil((entry.expiresAt - Date.now()) / 1000));
  }

  /** HSET key field value [field value ...] */
  async hset(key: string, values: Record<string, string>): Promise<number> {
    for (const [field, value] of Object.entries(values)) {
      this.store.set(`${key}:${field}`, { value, expiresAt: null });
    }
    return Object.keys(values).length;
  }

  /** HGETALL key */
  async hgetall(key: string): Promise<Record<string, string>> {
    const result: Record<string, string> = {};
    const prefix = `${key}:`;
    for (const [storedKey, entry] of this.store.entries()) {
      if (storedKey.startsWith(prefix) && !this.isExpired(entry)) {
        result[storedKey.slice(prefix.length)] = entry.value;
      }
    }
    return result;
  }

  /** EXPIRE key seconds — đặt TTL cho key đã tồn tại */
  async expire(key: string, seconds: number): Promise<number> {
    const entry = this.getEntry(key);
    if (!entry) return 0;
    this.store.set(key, { value: entry.value, expiresAt: Date.now() + seconds * 1000 });
    return 1;
  }

  /**
   * MULTI pipeline — trả về một object có thể chain .set/.del/.setex rồi .exec().
   * Thực thi tuần tự (không atomic như Redis thật, nhưng đủ cho fallback dev).
   */
  multi(): MultiBuilder {
    return new MultiBuilder(this);
  }
}

class MultiBuilder {
  private commands: Array<() => Promise<unknown>> = [];

  constructor(private readonly redis: MemoryRedis) {}

  del(...keys: string[]): this {
    this.commands.push(() => this.redis.del(...keys));
    return this;
  }

  set(key: string, value: string, exMode?: 'EX', seconds?: number): this {
    this.commands.push(() =>
      exMode === 'EX' && seconds !== undefined
        ? this.redis.setex(key, seconds, value)
        : this.redis.set(key, value),
    );
    return this;
  }

  setex(key: string, seconds: number, value: string): this {
    this.commands.push(() => this.redis.setex(key, seconds, value));
    return this;
  }

  async exec(): Promise<Array<[null, unknown]>> {
    const results: Array<[null, unknown]> = [];
    for (const cmd of this.commands) {
      results.push([null, await cmd()]);
    }
    return results;
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    redis: any; // Redis | MemoryRedis — dùng any để tương thích fallback
  }
}

const redisPlugin: FastifyPluginAsync = async (fastify) => {
  const redisUrl = process.env.REDIS_URL ?? 'redis://127.0.0.1:6379';

  let redis: Redis | MemoryRedis;

  try {
    const client = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    await client.connect();
    redis = client;
    fastify.log.info('Redis connected successfully');
  } catch (error) {
    fastify.log.warn(
      { err: error },
      'Redis unavailable — falling back to in-memory store (not suitable for production)',
    );
    redis = new MemoryRedis();
    await redis.connect();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fastify.decorate('redis', redis as any);

  fastify.addHook('onClose', async () => {
    await redis.quit();
  });
};

export default fp(redisPlugin, { name: 'redis' });
