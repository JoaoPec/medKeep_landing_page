import { Module } from '@nestjs/common';
import { mailerProviders } from '../providers';

@Module({
  providers: [...mailerProviders],
  exports: [...mailerProviders],
})
export class MailerModule {}
