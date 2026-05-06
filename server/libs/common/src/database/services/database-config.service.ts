import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { entities } from '../entities';
import { DatabaseConfig } from '../interfaces';

/**
 * Service responsible for providing TypeORM configuration options
 * @class DatabaseConfigService
 * @implements {TypeOrmOptionsFactory}
 * @description Configures database connection and behavior settings by reading from environment variables via ConfigService.
 */
@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  /**
   * Creates an instance of DatabaseConfigService
   * @constructor
   * @param {ConfigService} configService - NestJS ConfigService for accessing configuration values
   */
  constructor(private readonly configService: ConfigService) {}

  /**
   * Creates TypeORM configuration options
   * @method createTypeOrmOptions
   * @description Generates TypeORM module options by reading database config from environment
   * @returns {TypeOrmModuleOptions} TypeORM configuration object containing connection and behavior settings
   */
  public createTypeOrmOptions(): TypeOrmModuleOptions {
    // Get database configuration from environment
    const dbConfig: DatabaseConfig = this.configService.get<DatabaseConfig>('db');
    // Return TypeORM configuration object
    return {
      type: 'postgres', // Database type
      url: dbConfig.url, // Connection URL
      entities: entities, // Entity classes
      logging: dbConfig.logging, // SQL query logging
      synchronize: dbConfig.synchronize, // Auto schema sync
      ssl: dbConfig.ssl === true ? { rejectUnauthorized: false } : false, // SSL settings
      poolSize: 20, // Connection pool size
      maxQueryExecutionTime: 1000, // Query timeout in ms
    };
  }
}
