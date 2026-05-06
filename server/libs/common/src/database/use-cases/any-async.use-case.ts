import { FindManyOptions, QueryRunner, Repository } from 'typeorm';
import { Nullable } from '../../interfaces';
import { IAnyAsyncUseCase } from '../interfaces';

export class AnyAsyncUseCase<T> implements IAnyAsyncUseCase<T> {
  constructor(private readonly repository: Repository<T>) {}

  /**
   * Determines if any entity matching the given options exists.
   *
   * @param {FindManyOptions<T>} [options] - Conditions to match entities.
   * @param {QueryRunner} [queryRunner] - Optional transaction context.
   * @returns {Promise<boolean>} - True if any entity exists, false otherwise.
   */

  public async execute(options?: FindManyOptions<T>, queryRunner?: QueryRunner): Promise<boolean> {
    let result: Nullable<T>;

    if (!!queryRunner) {
      result = await queryRunner.manager
        .getRepository<T>(this.repository.metadata.target)
        .findOne(options);
    } else {
      result = await this.repository.findOne(options);
    }

    return !!result;
  }
}
