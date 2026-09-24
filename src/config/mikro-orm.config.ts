import { defineConfig } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { ConfigService } from '@nestjs/config';
import type { MikroOrmModuleAsyncOptions } from '@mikro-orm/nestjs';

const ormConfig = defineConfig({
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  driver: PostgreSqlDriver,
  extensions: [Migrator],
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5433),
  dbName: process.env.DB_NAME ?? 'langchain',
  user: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  ensureDatabase: true,
  migrations: {
    path: './dist/database/migrations',
    pathTs: './src/database/migrations',
  },
});

export const mikroOrmConfig: MikroOrmModuleAsyncOptions = {
  driver: PostgreSqlDriver,
  inject: [ConfigService],

  useFactory: (configService: ConfigService) => {
    return {
      ...ormConfig,
      host: configService.get<string>('DB_HOST') ?? 'localhost',
      port: Number(configService.get<string>('DB_PORT') ?? 5433),
      dbName: configService.get<string>('DB_NAME') ?? 'rag',
      user: configService.get<string>('DB_USER') ?? 'postgres',
      password: configService.get<string>('DB_PASSWORD') ?? 'postgres',
      ensureDatabase: true,
      registerRequestContext: true,

      allowGlobalContext: true,
    };
  },
};

export default ormConfig;
