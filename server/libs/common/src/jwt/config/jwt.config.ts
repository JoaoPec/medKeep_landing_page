import { ConfigService, registerAs } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService: ConfigService = new ConfigService();

export const jwtConfig = registerAs('jwt', () => {
  return {
    accessTokenSecret: configService.getOrThrow<string>('JWT_ACCESS_TOKEN_SECRET'),
    refreshTokenSecret: configService.getOrThrow<string>('JWT_REFRESH_TOKEN_SECRET'),
    accessTokenExpirationMs:
      configService.getOrThrow<number>('JWT_ACCESS_TOKEN_EXPIRATION_MS') ?? 3600000,
    refreshTokenExpirationMs:
      configService.getOrThrow<number>('JWT_REFRESH_TOKEN_EXPIRATION_MS') ?? 604800000,
  };
});
