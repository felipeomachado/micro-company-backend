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
        urls: ['amqp://user:Z1wfdAr8TTKl@174.129.50.31:5672/smartcomplain'],
        noAck: false,
        queue: 'company-backend'
      }
    }
    );

  await app.listen(() => logger.log('Microservice is listening!'));
}
bootstrap();
