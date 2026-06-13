// src/modules/chat/ws-jwt.guard.ts
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient();
    const token = this.extractToken(client);

    if (!token) {
      throw new UnauthorizedException('Missing authentication token');
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      client.data.user = { id: payload.sub, email: payload.email, role: payload.role };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid authentication token');
    }
  }

  private extractToken(client: any): string | null {
    // Try auth token first (socket.io auth: { token: '...' })
    const authToken = client.handshake?.auth?.token;
    if (authToken) {
      return authToken.startsWith('Bearer ') ? authToken.slice(7) : authToken;
    }

    // Fallback to query param
    const queryToken = client.handshake?.query?.token;
    if (queryToken) {
      return queryToken.startsWith('Bearer ') ? queryToken.slice(7) : queryToken;
    }

    // Fallback to header
    const headerToken = client.handshake?.headers?.authorization;
    if (headerToken) {
      return headerToken.startsWith('Bearer ') ? headerToken.slice(7) : headerToken;
    }

    return null;
  }
}
