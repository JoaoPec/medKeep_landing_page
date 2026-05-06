import { DatabaseConfigService } from './database-config.service';
import { RepositoryCacheService } from './repository-cache.service';

/**
 * Database service classes collection for centralized registration.
 *
 * @description
 * This array contains all database-related service classes that need to be
 * registered within the application's dependency injection container.
 *
 * @property {Array<typeof TenantConnectionService | typeof RepositoryCacheService>} dbServices
 * - Contains service classes that handle database connections and caching
 * - Each service is a provider that can be instantiated and injected by NestJS
 * - Used for bulk registration in the DatabaseModule
 */
export const dbServices: Array<typeof DatabaseConfigService | typeof RepositoryCacheService> = [
  DatabaseConfigService, // Manages tenant-specific database connections
  RepositoryCacheService, // Provides caching functionality for repositories
];

/**
 * Service exports for direct imports throughout the application.
 *
 * @description
 * These exports allow other modules to directly import specific database services
 * without having to import the entire database module. This promotes more
 * granular dependency management and clearer code organization.
 *
 * - TenantConnectionService: Manages database connections for multi-tenant architecture
 * - RepositoryCacheService: Provides caching capabilities for database repositories
 */
export { DatabaseConfigService, RepositoryCacheService };
