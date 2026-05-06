import { DispatchMessageDto } from '../dtos';

/**
 * Interface for the MailerService
 * @interface IMailerService
 * @description Defines the contract for the MailerService
 */
export interface IMailerService {
  /**
   * Dispatches a message
   * @param message - The message to dispatch
   */
  dispatch(message: DispatchMessageDto): Promise<void>;
}
