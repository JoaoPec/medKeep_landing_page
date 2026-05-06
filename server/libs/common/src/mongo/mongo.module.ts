import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { mongoConfig } from './config';
import { MongoFactory } from './factories';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [mongoConfig],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync(MongoFactory),
  ],
})
export class MongoModule {}
