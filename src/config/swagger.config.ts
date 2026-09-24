import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function getSwaggerConfig(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('cyberyan API')
    .setDescription('cyberyan API documentation')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
}
