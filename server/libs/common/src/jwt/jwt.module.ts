import { Global, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { jwtConfig } from './config';
import { JwtConfigService } from './services';

@Module({
  imports: [
    JwtModule,
    ConfigModule.forRoot({
      load: [jwtConfig],
      isGlobal: true,
    }),
  ],
  providers: [JwtConfigService],
  exports: [JwtConfigService, JwtModule],
})
export class JWTModule {}
