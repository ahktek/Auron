import Redis from "ioredis";

// In-memory fallback cache for environments where Redis container is not running
export class MemoryFallbackCache {
  private store = new Map<string, { value: string; expiry: number | null }>();

  async get(key: string): Promise<string | null> {
    const item = this.store.get(key);
    if (!item) return null;
    if (item.expiry && item.expiry < Date.now()) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key: string, value: string, ...args: (string | number)[]): Promise<string> {
    let expiry: number | null = null;
    const exIdx = args.findIndex((arg) => typeof arg === "string" && arg.toUpperCase() === "EX");
    if (exIdx !== -1 && args[exIdx + 1]) {
      expiry = Date.now() + Number(args[exIdx + 1]) * 1000;
    }
    this.store.set(key, { value, expiry });
    return "OK";
  }

  async del(key: string): Promise<number> {
    return this.store.delete(key) ? 1 : 0;
  }

  async incr(key: string): Promise<number> {
    const current = await this.get(key);
    const num = (current ? parseInt(current, 10) : 0) + 1;
    await this.set(key, num.toString());
    return num;
  }

  async expire(key: string, seconds: number): Promise<number> {
    const item = this.store.get(key);
    if (!item) return 0;
    item.expiry = Date.now() + seconds * 1000;
    return 1;
  }
}

const memoryFallback = new MemoryFallbackCache();
const redisUrl = process.env.REDIS_URL;

let activeClient: Redis | MemoryFallbackCache;

if (process.env.NODE_ENV === "test" || !redisUrl) {
  activeClient = memoryFallback;
} else {
  try {
    const client = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      retryStrategy: () => null,
      lazyConnect: true,
      enableOfflineQueue: false,
    });

    client.on("error", () => {
      // Fallback in memory
    });

    activeClient = client;
  } catch {
    activeClient = memoryFallback;
  }
}

export const redis = activeClient;

/**
 * Sliding window or counter rate limiter using Redis / Memory fallback
 */
export async function checkRateLimit(
  identifier: string,
  limit: number = 60,
  windowSeconds: number = 60
): Promise<{ success: boolean; remaining: number; reset: number }> {
  const key = `ratelimit:${identifier}`;
  const now = Date.now();
  const reset = Math.floor(now / 1000) + windowSeconds;

  try {
    const current = await redis.incr(key);
    if (current === 1) {
      await redis.expire(key, windowSeconds);
    }

    if (current > limit) {
      return {
        success: false,
        remaining: 0,
        reset,
      };
    }

    return {
      success: true,
      remaining: Math.max(0, limit - current),
      reset,
    };
  } catch {
    // If Redis connection drops, fall back to memory
    const current = await memoryFallback.incr(key);
    if (current === 1) {
      await memoryFallback.expire(key, windowSeconds);
    }
    return {
      success: current <= limit,
      remaining: Math.max(0, limit - current),
      reset,
    };
  }
}
