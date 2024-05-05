import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.RMQ,
      options: {
        urls: [
          'amqp://rabbitmq:rabbitmq@localhost:5672',
        ],
        queue: 'users_queue',
        queueOptions: {
          durable: false
        },
      },
    },
  );
  
  await app.startAllMicroservices();

  const config = new DocumentBuilder()
    .setDescription('The users API description')
    .setVersion('1.0')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  
  SwaggerModule.setup('api', app, document);

  await app.listen(5200);
}
bootstrap();
