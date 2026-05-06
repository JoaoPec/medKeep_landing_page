import { Global, Module } from '@nestjs/common';
import { PinoLoggerService } from './services';

@Global()
@Module({
  providers: [PinoLoggerService],
  exports: [PinoLoggerService],
})
export class LoggerModule {}
