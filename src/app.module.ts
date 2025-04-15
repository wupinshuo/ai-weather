import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherModule } from './weather/weather.module';
import { PrismaModule } from './prisma/prisma.module';
@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WeatherModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
