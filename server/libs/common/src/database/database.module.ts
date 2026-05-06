import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityTarget } from 'typeorm';
import { Either, Nullable } from '../interfaces';
import { dbConfig } from './configs';
import { createCachedRepositoryFactory, createRepositoryFactory } from './factories';
import { CachedRepositoryOptions, RepositoryEntityMap, RepositoryOptions } from './interfaces';
import { DatabaseConfigService, dbServices } from './services';

/**
 * Database module for managing database connections and repositories.
 *
 * @description
 * This module provides functionality for setting up database connections
 * and repositories in a multi-tenant environment. It supports both global
 * configuration and feature-specific repository registration with optional caching.
 *
 * @example
 * ```typescript
 * // Register global database services
 * @Module({
 *   imports: [DatabaseModule.forRoot()]
 * })
 * export class AppModule {}
 *
 * // Register entity repositories in a feature module
 * @Module({
 *   imports: [DatabaseModule.forFeature([User, Product])]
 * })
 * export class UsersModule {}
 * // Register with caching enabled
 *
 * @Module({
 *   imports: [
 *     DatabaseModule.forFeature([
 *       { entity: User, options: { cache: true, ttl: 3600 } }
 *     ])
 *   ]
 * })
 * export class CachedUsersModule {}
 */
@Module({})
export class DatabaseModule {
  /**
   * Registers global database services and providers.
   *
   * @description
   * This method configures the database module as a global module,
   * making its services available throughout the application without
   * needing to import it in every module. It sets up the core database
   * infrastructure including connection management services.
   *
   * @returns {DynamicModule} A configured NestJS dynamic module with global scope
   */
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: DatabaseModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [dbConfig],
        }),
        TypeOrmModule.forRootAsync({
          useClass: DatabaseConfigService,
        }),
      ],
      providers: [...dbServices],
      exports: [...dbServices],
    };
  }

  /**
   * Registers entity repositories for specific features.
   *
   * @description
   * This method creates repository providers for the specified entities,
   * making them available within the module that imports it. It supports
   * both standard repositories and cached repositories based on configuration.
   * Each repository is tenant-aware and scoped to the current request.
   *
   * @param {Array<Either<EntityTarget<any>, RepositoryEntityMap<any>>>} entities -
   *        Array of entities or entity configurations to register repositories for
   *
   * @returns {DynamicModule} A configured NestJS dynamic module with entity repositories
   *
   * @example
   * ```typescript
   * // Register repositories with simple entity classes
   * DatabaseModule.forFeature([User, Product])
   *
   * // Register repositories with caching configuration
   * DatabaseModule.forFeature([
   *   { entity: User, options: { cache: { keyPrefix: 'product-cache', ttl: 1800 } } },
   *   { entity: Product, options: { cache: true } },
   *   Order // Standard repository without caching
   * ])
   */
  static forFeature(
    entities: Array<Either<EntityTarget<any>, RepositoryEntityMap<any>>>,
  ): DynamicModule {
    const providers: Array<Provider> = entities.map(
      (entityItem: Either<EntityTarget<any>, RepositoryEntityMap<any>>) => {
        // Handle both simple entity class and entity with options
        const isCachedRepository =
          typeof entityItem === 'object' &&
          entityItem !== null &&
          'entity' in entityItem &&
          !!entityItem?.options?.cache;
        const entity: EntityTarget<any> =
          typeof entityItem === 'object' && entityItem !== null && 'entity' in entityItem
            ? (entityItem as { entity: EntityTarget<any> }).entity
            : (entityItem as EntityTarget<any>);
        const cachedOptions: Nullable<Either<Partial<CachedRepositoryOptions>, boolean>> =
          isCachedRepository ? (entityItem as { options: RepositoryOptions }).options.cache : null;

        if (isCachedRepository) {
          return createCachedRepositoryFactory(
            entity,
            typeof cachedOptions === 'boolean' ? undefined : cachedOptions,
          );
        }

        return createRepositoryFactory(entity);
      },
    );

    return {
      module: DatabaseModule,
      providers: providers,
      exports: providers,
    };
  }
}
