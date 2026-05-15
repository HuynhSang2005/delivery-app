import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';

async function exportOpenApi(): Promise<void> {
  const app = await NestFactory.create(AppModule, { logger: false });

  const config = new DocumentBuilder()
    .setTitle('Delivery App API')
    .setDescription('Canonical OpenAPI contract for shared clients')
    .setVersion('1.0.0')
    .addServer('/api/v1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const outputPath = resolve(process.cwd(), '../../packages/api-client/openapi/openapi.json');

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(document, null, 2)}\n`, 'utf8');

  await app.close();
  console.log(`[openapi] exported: ${outputPath}`);
}

exportOpenApi().catch((error: unknown) => {
  console.error('[openapi] export failed');
  throw error;
});
