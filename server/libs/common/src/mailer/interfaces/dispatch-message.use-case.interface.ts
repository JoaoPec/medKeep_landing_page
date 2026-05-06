import { OneOrMany } from '@app/common/interfaces';
import { DispatchMessageDto } from '../dtos';

/**
 * Interface for dispatching messages
 * @interface IDispatchMessageUseCase
 * @description Defines the contract for dispatching messages
 */
export interface IDispatchMessageUseCase {
  /**
   * Executes the dispatching of a message
   * @param message - The message to dispatch or an array of messages
   */
  execute(message: OneOrMany<DispatchMessageDto>): Promise<void>;
}
