import { OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
export declare class RedisService extends Redis implements OnModuleDestroy {
    private readonly configService;
    private readonly defaultTTL;
    private connected;
    constructor(configService: ConfigService);
    isAvailable(): boolean;
    onModuleDestroy(): Promise<void>;
    getJson<T>(key: string): Promise<T | null>;
    setJson(key: string, value: unknown, ttl?: number): Promise<void>;
    deletePattern(pattern: string): Promise<void>;
    invalidateUserCache(userId: string): Promise<void>;
    invalidateSessionListCache(): Promise<void>;
    blacklistToken(jti: string, ttlSeconds: number): Promise<void>;
    isTokenBlacklisted(jti: string): Promise<boolean>;
    storeRefreshTokenFingerprint(userId: string, fingerprint: string, ttlSeconds: number): Promise<void>;
    hasRefreshTokenFingerprint(userId: string, fingerprint: string): Promise<boolean>;
    deleteRefreshTokenFingerprint(userId: string, fingerprint: string): Promise<void>;
    deleteAllRefreshFingerprints(userId: string): Promise<void>;
    recordFailedLogin(identifier: string): Promise<number>;
    getFailedLoginCount(identifier: string): Promise<number>;
    resetFailedLogins(identifier: string): Promise<void>;
}
