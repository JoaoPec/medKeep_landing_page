import { ConfigService, registerAs } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService: ConfigService = new ConfigService();

export const appConfig = registerAs('app', () => {
  return {
    domain: configService.getOrThrow<string>('APP_DOMAIN_URL'),
    name: configService.getOrThrow<string>('APP_NAME'),
    frontendDomain: configService.getOrThrow<string>('APP_FRONTEND_DOMAIN_URL'),
    baseUrl: configService.getOrThrow<string>('APP_API_BASE_URL'),
    environment: configService.get('NODE_ENV', 'development'),
    partnershipNetwork: configService.getOrThrow<string>('APP_PARTNERSHIP_NETWORK_URL'),
    viaCep: configService.getOrThrow<string>('APP_VIA_CEP_URL'),
  };
});
