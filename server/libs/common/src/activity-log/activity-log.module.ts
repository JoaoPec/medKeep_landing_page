import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { I18nValidationExceptionFilter } from 'nestjs-i18n';
import { ActivityLogDocument, ActivityLogSchema } from '../mongo';
import { ActivityLogQueueProcessor } from './activity-log-queue.processor';
import { ActivityLogExceptionFilter } from './filters';
import { ActivityLogHttpInterceptor } from './interceptors';
import { EnqueueActivityLogUseCase, PersistActivityLogUseCase } from './use-cases';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ActivityLogDocument.name, schema: ActivityLogSchema }]),
  ],
  providers: [
    EnqueueActivityLogUseCase,
    PersistActivityLogUseCase,
    ActivityLogQueueProcessor,
    ActivityLogHttpInterceptor,
    {
      provide: ActivityLogExceptionFilter,
      useFactory: (enqueue: EnqueueActivityLogUseCase) =>
        new ActivityLogExceptionFilter(
          enqueue,
          new I18nValidationExceptionFilter({ detailedErrors: false }),
        ),
      inject: [EnqueueActivityLogUseCase],
    },
  ],
  exports: [
    MongooseModule,
    EnqueueActivityLogUseCase,
    ActivityLogHttpInterceptor,
    ActivityLogExceptionFilter,
  ],
})
export class ActivityLogModule {}
