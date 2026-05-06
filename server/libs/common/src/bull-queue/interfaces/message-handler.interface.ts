import { ProcessMessageOptions } from './process-message-options.interface';

export interface MessageHandler {
  handler: Function;
  options: ProcessMessageOptions;
}
