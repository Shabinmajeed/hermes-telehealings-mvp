"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = exports.mockRedisService = void 0;
exports.mockRedisService = {
    getJson: jest.fn().mockResolvedValue(null),
    setJson: jest.fn().mockResolvedValue(undefined),
    deletePattern: jest.fn().mockResolvedValue(undefined),
    invalidateUserCache: jest.fn().mockResolvedValue(undefined),
    invalidateSessionListCache: jest.fn().mockResolvedValue(undefined),
    blacklistToken: jest.fn().mockResolvedValue(undefined),
    isTokenBlacklisted: jest.fn().mockResolvedValue(false),
    storeRefreshTokenFingerprint: jest.fn().mockResolvedValue(undefined),
    hasRefreshTokenFingerprint: jest.fn().mockResolvedValue(false),
    deleteRefreshTokenFingerprint: jest.fn().mockResolvedValue(undefined),
    deleteAllRefreshFingerprints: jest.fn().mockResolvedValue(undefined),
    recordFailedLogin: jest.fn().mockResolvedValue(1),
    getFailedLoginCount: jest.fn().mockResolvedValue(0),
    resetFailedLogins: jest.fn().mockResolvedValue(undefined),
    quit: jest.fn().mockResolvedValue(undefined),
};
class RedisService {
    getJson = exports.mockRedisService.getJson;
    setJson = exports.mockRedisService.setJson;
    deletePattern = exports.mockRedisService.deletePattern;
    invalidateUserCache = exports.mockRedisService.invalidateUserCache;
    invalidateSessionListCache = exports.mockRedisService.invalidateSessionListCache;
    blacklistToken = exports.mockRedisService.blacklistToken;
    isTokenBlacklisted = exports.mockRedisService.isTokenBlacklisted;
    storeRefreshTokenFingerprint = exports.mockRedisService.storeRefreshTokenFingerprint;
    hasRefreshTokenFingerprint = exports.mockRedisService.hasRefreshTokenFingerprint;
    deleteRefreshTokenFingerprint = exports.mockRedisService.deleteRefreshTokenFingerprint;
    deleteAllRefreshFingerprints = exports.mockRedisService.deleteAllRefreshFingerprints;
    recordFailedLogin = exports.mockRedisService.recordFailedLogin;
    getFailedLoginCount = exports.mockRedisService.getFailedLoginCount;
    resetFailedLogins = exports.mockRedisService.resetFailedLogins;
    quit = exports.mockRedisService.quit;
}
exports.RedisService = RedisService;
//# sourceMappingURL=redis.service.js.map