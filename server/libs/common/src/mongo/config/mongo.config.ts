import { ConfigService, registerAs } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService: ConfigService = new ConfigService();

export const mongoConfig = registerAs('mongo', () => {
  return {
    uri: configService.getOrThrow<string>('MONGO_URI'),
  };
});
