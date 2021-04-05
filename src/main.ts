import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { environment } from '../config/environment';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('ULTRA sample API')
    .setDescription('The ULTRA sample API description')
    .setVersion('1.0')
    .addTag('ULTRA API')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(environment.port);
}
bootstrap();
