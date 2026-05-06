import { Nullable } from '@app/common/interfaces';
import { QueryRunner, Repository } from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { BulkUpdateData } from '../interfaces';

export class UpdateManyUseCase<T> {
  constructor(private readonly repository: Repository<T>) {}

  /**
   * Updates multiple entities in bulk using provided filters and update fields,
   * supporting both set, increment and decrement operations.
   *
   * @returns {Promise<number>}
   *   A promise that resolves to the number of rows affected by the update.
   */
  public async execute(updateData: BulkUpdateData<T>, queryRunner?: QueryRunner): Promise<number> {
    if (!updateData || updateData.length === 0) {
      return 0;
    }

    const tableName: string = this.repository.metadata.tablePath; // Includes schema if any

    // Get all columns of the entity
    const columns: Array<ColumnMetadata> = this.repository.metadata.columns;

    // Map database column names to entity property names
    const columnMap: Map<string, string> = new Map<string, string>();
    columns.forEach((col) => {
      columnMap.set(col.databaseName, col.propertyName);
    });

    // Check if the entity has a 'version' column
    const versionColumn: Nullable<ColumnMetadata> = columns.find(
      (col) => col.propertyName === 'version',
    );
    const hasVersionColumn: boolean = !!versionColumn;

    const params: Array<any> = [];
    let paramIndex: number = 1;

    // Build CASE expressions for each column to be updated
    const setClauses: Array<string> = [];

    // Build SET clauses for all columns except 'version'
    for (const column of columns) {
      const columnName: string = column.databaseName;
      const propertyName: string = columnMap.get(columnName);

      // Skip 'version' column as it's handled separately
      if (propertyName === 'version') {
        continue;
      }

      const cases: Array<string> = [];

      for (const data of updateData) {
        const updateValue = data.update[propertyName];

        if (updateValue !== undefined) {
          // Build condition for CASE WHEN
          const filterConditions: Array<string> = [];
          for (const [filterKey, filterValue] of Object.entries(data.filter)) {
            const filterColumn: ColumnMetadata = columns.find(
              (col) => col.propertyName === filterKey,
            );

            if (filterColumn) {
              const filterColumnName: string = filterColumn.databaseName;
              const filterParamName: string = `$${paramIndex++}`;

              params.push(filterValue);
              filterConditions.push(`"${filterColumnName}" = ${filterParamName}`);
            } else {
              throw new Error(`Filter column "${filterKey}" not found in entity.`);
            }
          }

          const whenCondition: string = filterConditions.join(' AND ');

          let valueExpression: string;

          switch (true) {
            // Increment field
            case typeof updateValue === 'object' &&
              updateValue !== null &&
              'increment' in updateValue: {
              // Increment operation
              const incrementValue = updateValue.increment;
              const valueParamName: string = `$${paramIndex++}`;

              params.push(incrementValue);
              valueExpression = `"${columnName}" + ${valueParamName}`;
              break;
            }
            // Decrement field
            case typeof updateValue === 'object' &&
              updateValue !== null &&
              'decrement' in updateValue: {
              // Increment operation
              const decrementValue = updateValue.decrement;
              const valueParamName: string = `$${paramIndex++}`;

              params.push(decrementValue);
              valueExpression = `"${columnName}" - ${valueParamName}`;
              break;
            }
            // Just set
            default: {
              // Set operation
              const valueParamName: string = `$${paramIndex++}`;

              params.push(updateValue);
              valueExpression = `${valueParamName}`;
              break;
            }
          }

          cases.push(`WHEN ${whenCondition} THEN ${valueExpression}`);
        }
      }

      if (cases.length > 0) {
        setClauses.push(`"${columnName}" = CASE ${cases.join(' ')} ELSE "${columnName}" END`);
      }
    }

    // Handle 'version' column separately
    if (hasVersionColumn) {
      setClauses.push(`"${versionColumn!.databaseName}" = "${versionColumn!.databaseName}" + 1`);
    }

    if (setClauses.length === 0) {
      // Nothing to update
      return 0;
    }

    // Build the WHERE clause to include all filters
    const allFilterConditions: Array<string> = [];

    for (const data of updateData) {
      const filterConditions: Array<string> = [];

      for (const [filterKey, filterValue] of Object.entries(data.filter)) {
        const filterColumn: ColumnMetadata = columns.find((col) => col.propertyName === filterKey);

        if (filterColumn) {
          const filterColumnName: string = filterColumn.databaseName;
          const filterParamName: string = `$${paramIndex++}`;

          params.push(filterValue);
          filterConditions.push(`"${filterColumnName}" = ${filterParamName}`);
        } else {
          throw new Error(`Filter column "${filterKey}" not found in entity.`);
        }
      }
      if (filterConditions.length > 0) {
        allFilterConditions.push(`(${filterConditions.join(' AND ')})`);
      }
    }

    const whereClause: string =
      allFilterConditions.length > 0 ? `WHERE ${allFilterConditions.join(' OR ')}` : '';

    const query: string = `
      UPDATE "${tableName}"
      SET ${setClauses.join(', ')}
      ${whereClause}
    `;

    let result;

    if (queryRunner) {
      result = await queryRunner.query(query, params);
    } else {
      result = await this.repository.query(query, params);
    }

    // Extract the number of affected rows
    let affectedRows: number = 0;

    // Handle different database drivers
    if (Array.isArray(result) && result.length > 1 && typeof result[1] === 'number') {
      // For some drivers like SQLite
      affectedRows = result[1];
    } else if (result && typeof result === 'object' && 'affectedRows' in result) {
      // MySQL
      affectedRows = result.affectedRows;
    } else if (result && typeof result === 'object' && 'rowCount' in result) {
      // PostgreSQL
      affectedRows = result.rowCount;
    } else if (typeof result === 'number') {
      // Some drivers return the number directly
      affectedRows = result;
    }

    return affectedRows;
  }
}
