import { BullQueuePublisherService } from './bull-queue-publisher.service';
import { BullQueueDiscoveryService } from './bull-queue-discovery.service';
import { BullQueueConfigService } from './bull-queue-config.service';
import { BullQueueRetryService } from './bull-queue-publisher-retry.service';
import { BullQueueBatchRetryService } from './bull-queue-batch-retry.service';
import { BullQueueManager } from './bull-queue-manager.service';
import { BullQueueProcessorService } from './bull-queue-processor.service';

export const bullServices = [
  BullQueuePublisherService,
  BullQueueDiscoveryService,
  BullQueueConfigService,
  BullQueueRetryService,
  BullQueueBatchRetryService,
  BullQueueManager,
  BullQueueProcessorService,
];

export {
  BullQueuePublisherService,
  BullQueueDiscoveryService,
  BullQueueConfigService,
  BullQueueRetryService,
  BullQueueBatchRetryService,
  BullQueueManager,
  BullQueueProcessorService,
};
