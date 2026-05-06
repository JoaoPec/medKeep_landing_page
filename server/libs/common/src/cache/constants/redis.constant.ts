/**
 * A unique symbol representing the Redis client instance.
 * This symbol is used to inject the Redis client into services or modules.
 */
export const REDIS_CLIENT: symbol = Symbol('REDIS_CLIENT');
