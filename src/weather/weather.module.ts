import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { EmailService } from './email.service';

@Module({
  imports: [],
  controllers: [WeatherController],
  providers: [WeatherService, EmailService],
  exports: [EmailService],
})
export class WeatherModule {}
