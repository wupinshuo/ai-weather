import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 注册服务的路由前缀
  app.setGlobalPrefix('api/v1');
  const port = process.env.PORT ?? 8080;
  await app.listen(port);
  console.log(`服务已启动，监听端口为:`, port);
}

bootstrap().catch((err) => {
  console.error('Error starting the application:', err);
});
