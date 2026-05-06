/**
 * Defines how each JSONB column is handled on conflict
 * - 'multiKey' - Merge on each key
 * - 'singleValue' - Merge on 'value' field
 * - 'none' - No special logic
 */
export type JsonbUpdateStrategy = 'multiKey' | 'singleValue' | 'none';
