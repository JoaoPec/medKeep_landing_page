import { Either, Nullable } from '@app/common/interfaces';
import { EntityMetadata, Repository } from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { JsonbUpdateStrategy } from '..';
import { UpsertPayload } from '../interfaces';

/**
 * Creates a PostgreSQL ON CONFLICT clause for upsert operations
 * @function createOnConflictClause
 * @description
 * Generates a PostgreSQL ON CONFLICT clause for handling upsert operations with various update strategies.
 * The function supports:
 * - Simple column updates
 * - Numeric increment/decrement operations
 * - JSONB column updates with different strategies
 * - Automatic version column increments for optimistic locking
 *
 * @param {Repository<T>} repository - TypeORM repository for the entity
 * @param {UpsertPayload<T>} upsertPayload - Configuration for the upsert operation
 * @returns {string} The generated ON CONFLICT clause SQL string
 *
 * @example
 * // Simple upsert with id conflict
 * const payload = {
 *   conflictKeys: ['id'],
 *   upsertUpdateOperations: {
 *     name: 'New Name',
 *     count: { increment: true }
 *   }
 * };
 * createOnConflictClause(userRepo, payload);
 * // Returns: (id) DO UPDATE SET name = EXCLUDED.name, count = users.count + EXCLUDED.count
 *
 * @example
 * // JSONB handling with multiKey strategy
 * const jsonbPayload = {
 *   conflictKeys: ['userId'],
 *   upsertUpdateOperations: {
 *     balances: { increment: true }
 *   },
 *   jsonbStrategy: {
 *     balances: 'multiKey'
 *   }
 * };
 * // For balances like: { USD: "100", EUR: "50" }
 * // Will merge and sum values per currency
 *
 * @example
 * // Version column handling
 * const versionedPayload = {
 *   conflictKeys: ['id'],
 *   upsertUpdateOperations: {
 *     data: 'new value'
 *   }
 * };
 * // Will automatically increment version column if present
 */
export function createOnConflictClause<T>(
  repository: Repository<T>,
  upsertPayload: UpsertPayload<T>,
): string {
  // Get entity metadata and table name
  const metadata: EntityMetadata = repository.metadata;
  const tableName: string = metadata.tableName;

  // Array to collect SQL SET assignments
  const updateAssignments: string[] = [];

  // Extract configuration from payload
  const { conflictKeys, upsertUpdateOperations, jsonbStrategy } = upsertPayload;

  // Process each property to build appropriate SET clauses
  for (const propertyName in upsertUpdateOperations) {
    // Get column metadata
    const col: ColumnMetadata | undefined = metadata.findColumnWithPropertyName(propertyName);

    if (!col) {
      throw new Error(`Column metadata for property "${propertyName}" not found.`);
    }

    const columnName: string = col.databaseName;
    const op = upsertUpdateOperations[propertyName];

    // Check if operation is increment/decrement
    const hasArithmetic =
      typeof op === 'object' && op !== null && ('increment' in op || 'decrement' in op);

    // Handle simple assignment case
    if (!hasArithmetic) {
      updateAssignments.push(`"${columnName}" = EXCLUDED."${columnName}"`);
      continue;
    }

    // Handle arithmetic operations
    const isIncrement = 'increment' in op;
    const operator: string = isIncrement ? '+' : '-';

    // Handle regular numeric columns
    if (col.type !== 'jsonb') {
      updateAssignments.push(
        `"${columnName}" = "${tableName}"."${columnName}" ${operator} EXCLUDED."${columnName}"`,
      );
      continue;
    }

    // Handle JSONB columns based on strategy
    const strategy: Either<JsonbUpdateStrategy, undefined> = jsonbStrategy?.[propertyName];
    const effectiveStrategy: Either<JsonbUpdateStrategy, undefined> = strategy ?? 'singleValue';

    switch (effectiveStrategy) {
      case 'multiKey':
        // Handle multi-key JSONB merge with arithmetic
        // Example: { USD: {value: "100"}, EUR: {value: "50"} }
        updateAssignments.push(`
          "${columnName}" = (
            SELECT jsonb_object_agg(
              COALESCE(old.key, new.key),
              CASE
                WHEN old.value IS NOT NULL AND new.value IS NOT NULL THEN
                  jsonb_set(
                    old.value,
                    '{value}',
                    to_jsonb(
                      (
                        (old.value->>'value')::bigint
                        ${operator}
                        (new.value->>'value')::bigint
                      )::text
                    )
                  )
                WHEN old.value IS NULL THEN
                  new.value
                ELSE
                  old.value
              END
            )
            FROM jsonb_each("${tableName}"."${columnName}") old
            FULL JOIN jsonb_each(EXCLUDED."${columnName}") new
            ON old.key = new.key
          )
        `);
        break;
      case 'singleValue':
        // Handle single-value JSONB with arithmetic on 'value' field
        updateAssignments.push(`
        "${columnName}" = jsonb_set(
          "${tableName}"."${columnName}",
          '{value}',
          to_jsonb(
            (
              (("${tableName}"."${columnName}"->>'value')::bigint)
              ${operator}
              ((EXCLUDED."${columnName}"->>'value')::bigint)
            )::text
          )
        )
        `);
        break;
      case 'none':
        // Simple JSONB assignment without special handling
        updateAssignments.push(`"${columnName}" = EXCLUDED."${columnName}"`);
        break;
    }
  }

  // Handle version column for optimistic locking
  const versionColumn: Nullable<ColumnMetadata> = metadata.columns.find(
    (c) => c.propertyName === 'version',
  );
  if (versionColumn) {
    updateAssignments.push(
      `"${versionColumn.databaseName}" = "${tableName}"."${versionColumn.databaseName}" + 1`,
    );
  }

  // Build conflict column list
  const conflictColumns: string[] = conflictKeys.map((prop) => {
    const conflictCol: Either<ColumnMetadata, undefined> = metadata.findColumnWithPropertyName(
      prop as string,
    );

    if (!conflictCol) {
      throw new Error(`Conflict column metadata for property "${String(prop)}" not found.`);
    }
    return `"${conflictCol.databaseName}"`;
  });

  // Generate final ON CONFLICT clause
  return `(${conflictColumns.join(', ')}) DO UPDATE SET ${updateAssignments.join(', ')}`;
}
