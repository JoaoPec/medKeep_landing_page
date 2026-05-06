import { FindManyOptions, QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';
import { ICountAsyncUseCase } from '../interfaces';

export class CountAsyncUseCase<T> implements ICountAsyncUseCase<T> {
  constructor(private readonly repository: Repository<T>) {}

  /**
   * Counts the number of entities based on provided options.
   *
   * @param {FindManyOptions<T>} [options] - Options to filter which entities to count.
   * @param {QueryRunner} [queryRunner] - Optional QueryRunner for transactional operations.
   * @returns {Promise<number>} - The count of entities matching the criteria.
   */
  public async execute(options?: FindManyOptions<T>, queryRunner?: QueryRunner): Promise<number> {
    // Get the table name (includes schema if any)
    const tableName: string = this.repository.metadata.tablePath;

    // Start building the query
    let query: string = `SELECT COUNT(*)::int AS count FROM "${tableName}" "t"`;

    // Parameters array for query parameters
    let parameters: any[] = [];

    // Build WHERE clause based on options.where
    if (options && options.where) {
      // Use QueryBuilder to generate the WHERE clause
      const qb: SelectQueryBuilder<T> = this.repository.createQueryBuilder('t');
      qb.where(options.where);

      // Get the SQL and parameters from the QueryBuilder
      const [sql, params]: [string, any[]] = qb.getQueryAndParameters();

      // Extract the WHERE clause from the SQL
      const whereIndex: number = sql.indexOf('WHERE');

      if (whereIndex !== -1) {
        const whereClause: string = sql.substring(whereIndex);
        query += ` ${whereClause}`;
      }

      // Assign parameters directly as an array
      parameters = params;
    }

    // Execute the raw SQL query
    let result: Array<{ count: string }>;

    if (queryRunner) {
      result = await queryRunner.query(query, parameters);
    } else {
      result = await this.repository.query(query, parameters);
    }

    // Return the count as a number
    return Number(result[0].count);
  }
}
