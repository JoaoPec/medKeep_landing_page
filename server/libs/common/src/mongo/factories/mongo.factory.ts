import { ConfigService, ConfigType } from '@nestjs/config';
import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { mongoConfig } from '../config';

export const MongoFactory: MongooseModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const mongoConfiguration: ConfigType<typeof mongoConfig> = configService.get('mongo');

    return {
      uri: mongoConfiguration.uri,
    };
  },
};
