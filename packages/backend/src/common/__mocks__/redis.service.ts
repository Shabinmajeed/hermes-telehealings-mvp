// src/common/__mocks__/redis.service.ts
export const mockRedisService = {
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

export class RedisService {
  getJson = mockRedisService.getJson;
  setJson = mockRedisService.setJson;
  deletePattern = mockRedisService.deletePattern;
  invalidateUserCache = mockRedisService.invalidateUserCache;
  invalidateSessionListCache = mockRedisService.invalidateSessionListCache;
  blacklistToken = mockRedisService.blacklistToken;
  isTokenBlacklisted = mockRedisService.isTokenBlacklisted;
  storeRefreshTokenFingerprint = mockRedisService.storeRefreshTokenFingerprint;
  hasRefreshTokenFingerprint = mockRedisService.hasRefreshTokenFingerprint;
  deleteRefreshTokenFingerprint = mockRedisService.deleteRefreshTokenFingerprint;
  deleteAllRefreshFingerprints = mockRedisService.deleteAllRefreshFingerprints;
  recordFailedLogin = mockRedisService.recordFailedLogin;
  getFailedLoginCount = mockRedisService.getFailedLoginCount;
  resetFailedLogins = mockRedisService.resetFailedLogins;
  quit = mockRedisService.quit;
}
