import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 注册服务的路由前缀
  app.setGlobalPrefix('api/v1');
  await app.listen(process.env.PORT ?? 8080);
}

bootstrap().catch((err) => {
  console.error('Error starting the application:', err);
});
