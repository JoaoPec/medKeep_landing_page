import { Injectable } from '@nestjs/common';
import { IMailerService } from '../interfaces';
import { OneOrMany } from '@app/common/interfaces';
import { DispatchMessageDto } from '../dtos';
import { DispatchMessageUseCase } from '../use-cases';

/**
 * Service responsible for handling email dispatch operations
 * @class MailerService
 * @implements IMailerService
 * @description Provides functionality to dispatch email messages through a message queue
 */
@Injectable()
export class MailerService implements IMailerService {
  /**
   * Creates an instance of MailerService
   * @param dispatchMessageUseCase - Use case for handling message dispatch operations
   */
  constructor(private readonly dispatchMessageUseCase: DispatchMessageUseCase) {}

  /**
   * Dispatches one or multiple email messages
   * @param message - Single message or array of messages to be dispatched
   * @returns Promise that resolves when messages are successfully queued
   */
  public async dispatch(message: OneOrMany<DispatchMessageDto>): Promise<void> {
    // Execute the dispatch message use case with the provided message(s)
    await this.dispatchMessageUseCase.execute(message);
  }
}
