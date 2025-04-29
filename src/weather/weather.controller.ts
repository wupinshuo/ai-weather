import { Controller, Get, Post } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  public async getWeather() {
    return await this.weatherService.getWeatherByAiSendEmailAndSave();
  }

  @Get('prisma/get')
  public async getWeatherByPrisma() {
    return await this.weatherService.getWeatherByPrisma();
  }

  @Post('prisma/create')
  public async createWeatherByPrisma() {
    return await this.weatherService.createWeatherByPrisma({
      id: 1001,
      province: '广东省',
      area: '广州市天河区',
      weather_date: '2025-01-01',
      timestamp: Date.now() / 1000,
      weather_condition: '晴天',
      temperature: '20℃',
      temperature_range: '20℃~30℃',
      wind: '微风',
      precipitation: '无降水',
      humidity: '60%',
      air_quality: '良',
      air_quality_index: '3',
      live_tips: '今天天气晴朗，适合户外运动。',
      tips: '记得携带伞和太阳镜。',
    });
  }
}
