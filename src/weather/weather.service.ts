import { Injectable } from '@nestjs/common';
import { aiService } from 'api/ai';
import { EmailService } from './email.service';

@Injectable()
export class WeatherService {
  public constructor(private readonly emailService: EmailService) {}

  /**
   * 调用ai接口查询今日天气情况
   * @param location 查询地点 默认：广东省广州市天河区
   */
  public async getWeatherByAi(location: string = '广东省广州市天河区') {
    const data = await aiService.getWeatherByLocation(location);
    if (!data) return '天气数据异常';
    // 解析数据
    const weatherData = JSON.parse(data || '{}');

    // 发送邮件
    const html = `
      <h1>早上好，吴帅</h1>
      <h2>今日天气情况：</h2>

      <p>今天天气: ${weatherData.weather_condition}</p>
      <p>当前温度：${weatherData.temperature}</P>
      <p>温度范围：${weatherData.temperature_range}</p>
      <p>风力信息：${weatherData.wind}</p>
      <p>降水信息：${weatherData.precipitation}</p>
      <p>湿度：${weatherData.humidity}</p>
      <p>空气质量：${weatherData.air_quality}</p>
      <p>空气质量指数：${weatherData.air_quality_index}</p>
      <p>生活建议：${weatherData.tips}</p>
      <p>温馨提示：${weatherData.tips_2}</p>

      <p>以上数据仅供参考，具体情况以实际情况为准。</p>
    `;
    this.emailService.sendEmail('今日天气情况', html);

    return data;
  }
}
