"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = __importDefault(require("ioredis"));
let RedisService = class RedisService extends ioredis_1.default {
    configService;
    defaultTTL;
    connected = false;
    constructor(configService) {
        const redisUrl = configService.get('REDIS_URL') || 'redis://localhost:6379';
        super(redisUrl, {
            retryStrategy: (times) => {
                if (times > 3)
                    return null;
                return Math.min(times * 200, 1000);
            },
            lazyConnect: true,
            maxRetriesPerRequest: 1,
        });
        this.configService = configService;
        this.defaultTTL = parseInt(configService.get('CACHE_TTL') || '300', 10);
        this.connect().then(() => {
            this.connected = true;
        }).catch(() => {
        });
        this.on('error', () => {
            this.connected = false;
        });
    }
    isAvailable() {
        return this.connected;
    }
    async onModuleDestroy() {
        await this.quit();
    }
    async getJson(key) {
        if (!this.connected)
            return null;
        try {
            const raw = await this.get(key);
            if (!raw)
                return null;
            try {
                return JSON.parse(raw);
            }
            catch {
                return null;
            }
        }
        catch {
            return null;
        }
    }
    async setJson(key, value, ttl) {
        if (!this.connected)
            return;
        try {
            const serialized = JSON.stringify(value);
            if (ttl) {
                await this.setex(key, ttl, serialized);
            }
            else {
                await this.setex(key, this.defaultTTL, serialized);
            }
        }
        catch {
        }
    }
    async deletePattern(pattern) {
        if (!this.connected)
            return;
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
        }
        catch {
        }
    }
    async invalidateUserCache(userId) {
        await this.deletePattern(`user:${userId}:*`);
    }
    async invalidateSessionListCache() {
        await this.deletePattern('sessions:list:*');
    }
    async blacklistToken(jti, ttlSeconds) {
        await this.setex(`token:blacklist:${jti}`, ttlSeconds, '1');
    }
    async isTokenBlacklisted(jti) {
        const result = await this.get(`token:blacklist:${jti}`);
        return result !== null;
    }
    async storeRefreshTokenFingerprint(userId, fingerprint, ttlSeconds) {
        await this.setex(`refresh:${userId}:${fingerprint}`, ttlSeconds, '1');
    }
    async hasRefreshTokenFingerprint(userId, fingerprint) {
        const result = await this.get(`refresh:${userId}:${fingerprint}`);
        return result !== null;
    }
    async deleteRefreshTokenFingerprint(userId, fingerprint) {
        await this.del(`refresh:${userId}:${fingerprint}`);
    }
    async deleteAllRefreshFingerprints(userId) {
        await this.deletePattern(`refresh:${userId}:*`);
    }
    async recordFailedLogin(identifier) {
        const key = `login:failed:${identifier}`;
        const count = await this.incr(key);
        if (count === 1) {
            await this.expire(key, 900);
        }
        return count;
    }
    async getFailedLoginCount(identifier) {
        const count = await this.get(`login:failed:${identifier}`);
        return count ? parseInt(count, 10) : 0;
    }
    async resetFailedLogins(identifier) {
        await this.del(`login:failed:${identifier}`);
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RedisService);
//# sourceMappingURL=redis.service.js.map