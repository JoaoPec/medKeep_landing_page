import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtConfig } from '../interfaces';

@Injectable()
export class JwtConfigService {
  constructor(private readonly config: ConfigService) {}

  get env(): JwtConfig {
    return {
      accessTokenExpirationMs: this.config.getOrThrow('jwt.accessTokenExpirationMs'),
      accessTokenSecret: this.config.getOrThrow('jwt.accessTokenSecret'),
      refreshTokenExpirationMs: this.config.getOrThrow('jwt.refreshTokenExpirationMs'),
      refreshTokenSecret: this.config.getOrThrow('jwt.refreshTokenSecret'),
    };
  }
}
