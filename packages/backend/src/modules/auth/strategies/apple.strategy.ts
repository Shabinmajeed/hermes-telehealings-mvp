import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-apple';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('APPLE_CLIENT_ID'),
      teamID: configService.get<string>('APPLE_TEAM_ID'),
      callbackURL: configService.get<string>('APPLE_CALLBACK_URL'),
      keyID: configService.get<string>('APPLE_KEY_ID'),
      privateKeyLocation: configService.get<string>('APPLE_PRIVATE_KEY_LOCATION'),
      scope: ['email', 'name'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
    try {
      const { emailAddress, name, sub } = profile;
      const user = await this.authService.validateOAuthUser({
        email: emailAddress,
        firstName: name?.firstName || '',
        lastName: name?.lastName || '',
        provider: 'apple',
        providerId: sub,
      });
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
}
