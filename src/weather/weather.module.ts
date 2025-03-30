import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';

@Module({
  imports: [],
  controllers: [WeatherController],
  providers: [WeatherService],
  exports: [],
})
export class WeatherModule {}
