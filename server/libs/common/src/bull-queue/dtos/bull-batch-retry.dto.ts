export interface BullBatchRetryPublishInputDto {
  queueName: string;
  messages: Record<string, any>[];
  chunkSize: number;
  delayBetweenChunks?: number;
}
