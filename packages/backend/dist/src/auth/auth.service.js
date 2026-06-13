"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcryptjs"));
const crypto = __importStar(require("crypto"));
const prisma_service_1 = require("../common/prisma.service");
const redis_service_1 = require("../common/redis.service");
const roles_decorator_1 = require("./roles.decorator");
let AuthService = class AuthService {
    prisma;
    jwtService;
    configService;
    redisService;
    MAX_FAILED_LOGINS = 5;
    LOCKOUT_DURATION_MS = 15 * 60 * 1000;
    constructor(prisma, jwtService, configService, redisService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
        this.redisService = redisService;
    }
    async register(email, password, role = roles_decorator_1.Role.CLIENT) {
        const existing = await this.prisma.user.findUnique({ where: { email } });
        if (existing) {
            throw new common_1.ConflictException('Email already registered');
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await this.prisma.user.create({
            data: { email, password: hashedPassword, role },
        });
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        return { user: { id: user.id, email: user.email, role: user.role }, ...tokens };
    }
    async login(email, password, ip) {
        const identifier = ip ? `${email}:${ip}` : email;
        const failedCount = await this.redisService.getFailedLoginCount(identifier);
        if (failedCount >= this.MAX_FAILED_LOGINS) {
            throw new common_1.ForbiddenException('Account temporarily locked due to too many failed login attempts. Try again in 15 minutes.');
        }
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            await this.redisService.recordFailedLogin(identifier);
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            await this.redisService.recordFailedLogin(identifier);
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.status === 'SUSPENDED') {
            throw new common_1.ForbiddenException('Account suspended. Contact support.');
        }
        await this.redisService.resetFailedLogins(identifier);
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        return { user: { id: user.id, email: user.email, role: user.role }, ...tokens };
    }
    async refresh(userId, refreshToken) {
        let payload;
        try {
            payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const tokenFingerprint = this.getTokenFingerprint(refreshToken);
        const hasFingerprint = await this.redisService.hasRefreshTokenFingerprint(userId, tokenFingerprint);
        if (hasFingerprint) {
            await this.redisService.deleteAllRefreshFingerprints(userId);
            await this.prisma.refreshToken.deleteMany({ where: { userId } });
            throw new common_1.UnauthorizedException('Refresh token reuse detected. All sessions invalidated.');
        }
        const storedToken = await this.prisma.refreshToken.findFirst({
            where: { userId, token: refreshToken },
        });
        if (!storedToken || storedToken.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        await this.redisService.storeRefreshTokenFingerprint(userId, tokenFingerprint, 7 * 24 * 3600);
        await this.prisma.refreshToken.delete({ where: { id: storedToken.id } });
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        return tokens;
    }
    async logout(userId, accessTokenJti) {
        if (accessTokenJti) {
            const ttl = this.configService.get('JWT_EXPIRY_SECONDS', 900);
            await this.redisService.blacklistToken(accessTokenJti, ttl);
        }
        await this.prisma.refreshToken.deleteMany({ where: { userId } });
        await this.redisService.deleteAllRefreshFingerprints(userId);
        return { message: 'Logged out successfully' };
    }
    async logoutAll(userId) {
        await this.prisma.refreshToken.deleteMany({ where: { userId } });
        await this.redisService.deleteAllRefreshFingerprints(userId);
        return { message: 'All sessions logged out successfully' };
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { clientProfile: true, therapistProfile: true },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const { password, ...result } = user;
        return result;
    }
    async generateTokens(userId, email, role) {
        const jti = crypto.randomUUID();
        const payload = { sub: userId, email, role, jti };
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: this.configService.get('JWT_EXPIRY', '15m'),
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRY', '7d'),
        });
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await this.prisma.refreshToken.create({
            data: { userId, token: refreshToken, expiresAt },
        });
        return { accessToken, refreshToken };
    }
    getTokenFingerprint(token) {
        return crypto.createHash('sha256').update(token).digest('hex').substring(0, 16);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService,
        redis_service_1.RedisService])
], AuthService);
//# sourceMappingURL=auth.service.js.map