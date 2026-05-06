/**
 * Represents the possible types for entity identifiers in the database.
 *
 * @json
 * {
 *   "type": "EntityId",
 *   "description": "Union type for database entity identifiers",
 *   "values": [
 *     {
 *       "type": "bigint",
 *       "description": "For large numeric identifiers beyond JavaScript number limits"
 *     },
 *     {
 *       "type": "number",
 *       "description": "For numeric identifiers within JavaScript number range"
 *     },
 *     {
 *       "type": "string",
 *       "description": "For string-based identifiers like UUIDs or custom formats"
 *     }
 *   ]
 * }
 */
export type EntityId = bigint | number | string;
