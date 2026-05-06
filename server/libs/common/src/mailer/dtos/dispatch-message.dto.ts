import { MessageChannel } from '../enums';

/**
 * Base interface for message properties across different channels
 * @interface BaseMessageDto
 * @description Defines common properties required for any message type
 */
export interface BaseMessageDto {
  /**
   * Recipient address/identifier for the message
   * @type {string}
   * @required
   */
  to: string;
}

/**
 * Interface for email-specific message properties
 * @interface EmailMessageDto
 * @description Extends base message with email-specific fields
 * @extends {BaseMessageDto}
 */
export interface EmailMessageDto extends BaseMessageDto {
  /**
   * Identifies this as an email message type
   * @type {MessageChannel.Email}
   * @required
   */
  type: MessageChannel.Email;

  /**
   * Subject line of the email
   * @type {string}
   * @required
   */
  subject: string;

  /**
   * Language of the email
   * @type {string}
   * @optional
   */
  language: string;

  /**
   * Template name to use for rendering the email (without extension)
   * @type {string}
   * @optional
   */
  template?: string;

  /**
   * Context data to pass to the template for rendering
   * @type {Record<string, any>}
   * @optional
   */
  context?: Record<string, any>;
}

/**
 * Union type for all supported message types
 * @type {EmailMessageDto}
 * @description Currently only supports email messages but designed for extension to other channels
 */
export type DispatchMessageDto = EmailMessageDto;
