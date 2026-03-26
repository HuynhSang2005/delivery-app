import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

function bootstrap(): void {
  NestFactory.create(AppModule)
    .then((app) => app.listen(process.env.PORT ?? 3000))
    .catch((error: unknown) => {
      throw error;
    });
}

bootstrap();
