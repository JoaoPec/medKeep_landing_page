import { BullQueuePublisherService, BullTopic } from '@app/common/bull-queue';
import { Injectable } from '@nestjs/common';
import { DispatchMessageDto } from '../dtos';
import { OneOrMany } from '@app/common/interfaces';
import { IDispatchMessageUseCase } from '../interfaces';

/**
 * Use case for dispatching messages
 * @class DispatchMessageUseCase
 * @implements IDispatchMessageUseCase
 * @description Dispatches a message to the appropriate queue
 */
@Injectable()
export class DispatchMessageUseCase implements IDispatchMessageUseCase {
  constructor(private readonly bullQueuePublisherService: BullQueuePublisherService) {}

  /**
   * Executes the dispatching of a message
   * @param message - The message to dispatch
   */
  public async execute(message: OneOrMany<DispatchMessageDto>): Promise<void> {
    const normalizedMessages: DispatchMessageDto[] = Array.isArray(message) ? message : [message];

    await this.bullQueuePublisherService.publish({
      queueName: BullTopic.Mailer,
      data: normalizedMessages,
    });
  }
}
