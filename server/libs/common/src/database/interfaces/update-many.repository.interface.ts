import { QueryRunner } from 'typeorm';
import { BulkUpdateData } from './bulk-update-data.interface';

/**
 * Interface defining repository operations for bulk updating multiple database records
 * @interface IUpdateManyRepository
 * @description Provides functionality to update multiple records in the database in a single operation
 * @template T - The entity type being updated
 */
export interface IUpdateManyRepository<T> {
  /**
   * Updates multiple records in the database based on provided criteria and update values
   * @param {BulkUpdateData<T>} updateData - Object containing the criteria and values for the bulk update operation
   * @param {QueryRunner} [queryRunner] - Optional TypeORM query runner for transaction support
   * @returns {Promise<number>} Number of records affected by the update operation
   */
  updateMany(updateData: BulkUpdateData<T>, queryRunner?: QueryRunner): Promise<number>;
}
