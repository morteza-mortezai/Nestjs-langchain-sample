import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './config/env.validation';
import { appConfig } from './config/app.config';
import { mikroOrmConfig } from './config/mikro-orm.config';
import { AppController } from './app.controller';
import { DocumentsModule } from './modules/documents/documents.module';
import { EmbeddingsModule } from './modules/embeddings/embeddings.module';
import { RagModule } from './modules/rag/rag.module';
import { LlmModule } from './modules/llm/llm.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
      load: [appConfig],
      validationOptions: {
        libraryOptions: {
          abortEarly: true,
        },
      },
    }),
    MikroOrmModule.forRootAsync(mikroOrmConfig),
    DocumentsModule,
    EmbeddingsModule,
    RagModule,
    LlmModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
