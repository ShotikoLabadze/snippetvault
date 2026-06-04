import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from './app.module';

const server = express();

export const createNestServer = async () => {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.init();
  return server;
};

if (process.env.NODE_ENV !== 'production') {
  createNestServer().then(() => {
    server.listen(process.env.PORT ?? 3000, () => {
      console.log('Running on http://localhost:3000');
    });
  });
}

export default createNestServer;
