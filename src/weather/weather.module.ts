import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { EmailService } from './email.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WeatherController],
  providers: [WeatherService, EmailService],
  exports: [EmailService],
})
export class WeatherModule {}
