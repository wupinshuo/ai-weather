import { Injectable } from '@nestjs/common';
import { aiService } from 'api/ai';

@Injectable()
export class WeatherService {
  /**
   * 调用ai接口查询今日天气情况
   * @param location 查询地点 默认：广东省广州市天河区
   */
  public async getWeatherByAi(location: string = '广东省广州市天河区') {
    return await aiService.getWeatherByLocation(location);
  }
}
