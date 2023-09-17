import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('Private Pension API')
  .setDescription('Pension and product plans')
  .setVersion('1.0')
  .addTag('pension')
  .build();

export const setupSwagger = (app: NestFastifyApplication) => {
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);
};
