// src/common/use-cases/find-by-filters.usecase.ts

import { FindManyOptions, FindOptionsWhere, In, QueryRunner, Repository } from 'typeorm';
import { Either, Nullable, OneOrMany } from '../../interfaces';
import { GetAsyncOptions, IGetAsyncUseCase } from '../interfaces';

/**
 * Generic Use Case for finding entities based on multiple condictions
 * Note: This is a plain class without @Injectable() decorator.
 */
export class GetAsyncUseCase<T> implements IGetAsyncUseCase<T> {
  constructor(
    private readonly repository: Repository<T>,
    private readonly defaultRelations: Array<string> = [],
  ) {}

  /**
   * Get entities based on various payloads and optional relations.
   * @param getEntityPayload - Either an ID or an array of IDs, a set of filters or an array of set of filters.
   * @param optionsOrQueryRunner - Either GetAsyncOptions or QueryRunner.
   * @param queryRunner - Optional QueryRunner if optionsOrQueryRunner is GetAsyncOptions.
   * @returns A single entity, an array of entities, or nulls.
   */

  public async execute(getEntityPayload: number, queryRunner?: QueryRunner): Promise<Nullable<T>>;
  public async execute(
    getEntityPayload: number,
    options: GetAsyncOptions,
    queryRunner?: QueryRunner,
  ): Promise<Nullable<T>>;

  public async execute(
    getEntityPayload: FindOptionsWhere<T>,
    queryRunner?: QueryRunner,
  ): Promise<Nullable<T>>;

  public async execute(
    getEntityPayload: FindOptionsWhere<T>,
    options: GetAsyncOptions,
    queryRunner?: QueryRunner,
  ): Promise<Nullable<T>>;

  public async execute(
    getEntityPayload: FindOptionsWhere<T>,
    options: GetAsyncOptions & { array: true },
    queryRunner?: QueryRunner,
  ): Promise<Array<T>>;

  public async execute(
    getEntityPayload: Array<FindOptionsWhere<T>>,
    options: GetAsyncOptions,
    queryRunner?: QueryRunner,
  ): Promise<Array<T>>;

  public async execute(
    getEntityPayload: Array<FindOptionsWhere<T>>,
    queryRunner?: QueryRunner,
  ): Promise<Array<T>>;

  public async execute(
    getEntityPayload: Array<number>,
    queryRunner?: QueryRunner,
  ): Promise<Array<T>>;
  public async execute(
    getEntityPayload: Array<number>,
    options: GetAsyncOptions,
    queryRunner?: QueryRunner,
  ): Promise<Array<T>>;

  public async execute(
    getEntityPayload: Either<OneOrMany<number>, OneOrMany<FindOptionsWhere<T>>>,
    optionsOrQueryRunner?: Either<
      Either<GetAsyncOptions, GetAsyncOptions & { array: true }>,
      QueryRunner
    >,
    queryRunner?: QueryRunner,
  ): Promise<Either<Array<T>, Nullable<T>>> {
    let repo: Repository<T>;
    let options: Nullable<GetAsyncOptions>;

    // Determine if the second argument is a QueryRunner or GetAsyncOptions
    if ((!!optionsOrQueryRunner && 'manager' in optionsOrQueryRunner) || !optionsOrQueryRunner) {
      queryRunner = optionsOrQueryRunner as QueryRunner;
    } else {
      options = optionsOrQueryRunner as GetAsyncOptions;
    }

    // Use QueryRunner's repository if provided, else use the injected repository
    repo = !!queryRunner
      ? queryRunner.manager.getRepository<T>(this.repository.metadata.target)
      : this.repository;

    // Determine relations to use: options.relations or defaultRelations
    const relationsToUse: Array<string> = options?.relations ?? this.defaultRelations;

    // Handle finding by ID
    if (typeof getEntityPayload === 'number') {
      const entity: T = await repo.findOne({
        where: { id: getEntityPayload } as unknown as FindOptionsWhere<T>,
        relations: relationsToUse,
      });
      return entity as Nullable<T>;
    }

    // Handle finding by an array of IDs
    if (Array.isArray(getEntityPayload)) {
      const isArrayOfBigints: boolean = getEntityPayload.every(
        (element) => typeof element === 'bigint',
      );

      let findManyOptions: FindManyOptions<T> = {
        where: isArrayOfBigints
          ? ({ id: In(getEntityPayload as Array<number>) } as unknown as FindOptionsWhere<T>)
          : (getEntityPayload as Array<FindOptionsWhere<T>>),
        relations: relationsToUse,
      };

      if (!!options?.skip) {
        findManyOptions.skip = options.skip;
      }

      if (!!options?.take) {
        findManyOptions.take = options.take;
      }

      const entities: Array<T> = await repo.find(findManyOptions);
      return entities;
    }

    // Handle finding by filters with options (e.g., array = true)
    if (options?.array === true) {
      const entities: Array<Nullable<T>> = await repo.find({
        where: getEntityPayload as FindOptionsWhere<T>,
        relations: relationsToUse,
      });
      return entities;
    }

    // Default case: find one entity by filters
    const entity: T = await repo.findOne({
      where: getEntityPayload as FindOptionsWhere<T>,
      relations: relationsToUse,
    });
    return entity as Nullable<T>;
  }
}
