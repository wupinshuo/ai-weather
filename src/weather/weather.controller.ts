import { Controller, Get, Param } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get(':userId')
  public async getWeather(@Param('userId') userId: string) {
    return this.weatherService.getWeatherByAi(userId);
  }
}
