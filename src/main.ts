import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // para configurarar las rutas de los endpoint y anteponer u prefijo
  app.setGlobalPrefix('api/v2');

  // Configuracion global de los Pipes para validación de data
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }));


  await app.listen(3000);
}
bootstrap();
