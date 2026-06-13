import { ConfigService } from '@nestjs/config';
import { RedisService } from '../common/redis.service';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private redisService;
    constructor(configService: ConfigService, redisService: RedisService);
    validate(payload: {
        sub: string;
        email: string;
        role: string;
        jti: string;
    }): Promise<{
        id: string;
        email: string;
        role: string;
        jti: string;
    }>;
}
export {};
