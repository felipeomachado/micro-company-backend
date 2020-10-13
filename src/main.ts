import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, 
    {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_URL}`],
        noAck: false,
        queue: 'company-backend',
        port: process.env.PORT || 3000
      }
    }
    );

  await app.listen(() => logger.log('Microservice is listening!'));
}
bootstrap();
