// src/common/redis.service.ts
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  private readonly defaultTTL: number;
  private connected = false;

  constructor(private readonly configService: ConfigService) {
    const redisUrl = configService.get<string>('REDIS_URL') || 'redis://localhost:6379';
    super(redisUrl, {
      retryStrategy: (times: number) => {
        if (times > 3) return null; // stop retrying after 3 attempts
        return Math.min(times * 200, 1000);
      },
      lazyConnect: true,
      maxRetriesPerRequest: 1,
    });
    this.defaultTTL = parseInt(configService.get<string>('CACHE_TTL') || '300', 10);

    // Try to connect, but don't fail if Redis is unavailable
    this.connect().then(() => {
      this.connected = true;
    }).catch(() => {
      // Redis unavailable — cache operations will be no-ops
    });

    this.on('error', () => {
      this.connected = false;
    });
  }

  isAvailable(): boolean {
    return this.connected;
  }

  async onModuleDestroy() {
    await this.quit();
  }

  async getJson<T>(key: string): Promise<T | null> {
    if (!this.connected) return null;
    try {
      const raw = await this.get(key);
      if (!raw) return null;
      try {
        return JSON.parse(raw) as T;
      } catch {
        return null;
      }
    } catch {
      return null;
    }
  }

  async setJson(key: string, value: unknown, ttl?: number): Promise<void> {
    if (!this.connected) return;
    try {
      const serialized = JSON.stringify(value);
      if (ttl) {
        await this.setex(key, ttl, serialized);
      } else {
        await this.setex(key, this.defaultTTL, serialized);
      }
    } catch {
      // ignore cache write errors
    }
  }

  async deletePattern(pattern: string): Promise<void> {
    if (!this.connected) return;
    try {
      let cursor = '0';
      do {
        const [next, keys] = await this.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
        cursor = next;
        if (keys.length > 0) {
          const pipeline = this.pipeline();
          for (const key of keys) {
            pipeline.del(key);
          }
          await pipeline.exec();
        }
      } while (cursor !== '0');
    } catch {
      // ignore cache delete errors
    }
  }

  async invalidateUserCache(userId: string): Promise<void> {
    await this.deletePattern(`user:${userId}:*`);
  }

  async invalidateSessionListCache(): Promise<void> {
    await this.deletePattern('sessions:list:*');
  }

  // --- Token Blacklist (JWT Revocation) ---

  async blacklistToken(jti: string, ttlSeconds: number): Promise<void> {
    await this.setex(`token:blacklist:${jti}`, ttlSeconds, '1');
  }

  async isTokenBlacklisted(jti: string): Promise<boolean> {
    const result = await this.get(`token:blacklist:${jti}`);
    return result !== null;
  }

  async storeRefreshTokenFingerprint(userId: string, fingerprint: string, ttlSeconds: number): Promise<void> {
    await this.setex(`refresh:${userId}:${fingerprint}`, ttlSeconds, '1');
  }

  async hasRefreshTokenFingerprint(userId: string, fingerprint: string): Promise<boolean> {
    const result = await this.get(`refresh:${userId}:${fingerprint}`);
    return result !== null;
  }

  async deleteRefreshTokenFingerprint(userId: string, fingerprint: string): Promise<void> {
    await this.del(`refresh:${userId}:${fingerprint}`);
  }

  async deleteAllRefreshFingerprints(userId: string): Promise<void> {
    await this.deletePattern(`refresh:${userId}:*`);
  }

  // --- Brute-force protection ---

  async recordFailedLogin(identifier: string): Promise<number> {
    const key = `login:failed:${identifier}`;
    const count = await this.incr(key);
    if (count === 1) {
      await this.expire(key, 900);
    }
    return count;
  }

  async getFailedLoginCount(identifier: string): Promise<number> {
    const count = await this.get(`login:failed:${identifier}`);
    return count ? parseInt(count, 10) : 0;
  }

  async resetFailedLogins(identifier: string): Promise<void> {
    await this.del(`login:failed:${identifier}`);
  }
}
