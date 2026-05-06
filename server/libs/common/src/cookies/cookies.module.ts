import { Global, Module } from '@nestjs/common';
import { CookieAdapter } from './providers';

@Global()
@Module({
  providers: [CookieAdapter],
  exports: [CookieAdapter],
})
export class CookieModule {}
