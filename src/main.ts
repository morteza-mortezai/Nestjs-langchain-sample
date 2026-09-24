import { NestFactory } from '@nestjs/core';
import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/exeptions/global-exception.filter';
import { ConfigService } from '@nestjs/config';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { getSwaggerConfig } from './config/swagger.config';

async function bootstrap() {
  const logger = new Logger('APP');

  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  const config = app.get(ConfigService);

  app.setGlobalPrefix(config.getOrThrow<string>('app.apiPrefix'), {
    exclude: [{ path: '', method: RequestMethod.GET }],
  });

  getSwaggerConfig(app);

  const APP_PORT = config.getOrThrow<number>('app.port') ?? 4000;

  await app.listen(APP_PORT, '0.0.0.0', () => {
    logger.log(`Application is running on: http://localhost:${APP_PORT}`);
    logger.log(`Swagger documentation: http://localhost:${APP_PORT}/docs`);
  });
}
void bootstrap();
