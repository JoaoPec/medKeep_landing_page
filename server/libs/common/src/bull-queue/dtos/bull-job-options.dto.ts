import { JobOptions } from 'bull';

export interface BullJobOptions extends JobOptions {
  batch?: boolean;
  batchSize?: number;
}
