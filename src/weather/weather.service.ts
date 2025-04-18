import { Injectable } from '@nestjs/common';
import { aiService } from '../../api/ai';
import { EmailService } from './email.service';
import { PrismaService } from '../prisma/prisma.service';
import { Weather } from '@prisma/client';

@Injectable()
export class WeatherService {
  public constructor(
    private readonly emailService: EmailService,
    private readonly prismaService: PrismaService,
  ) {}

  /**
   * 查询Prisma中的weather数据
   */
  public async getWeatherByPrisma() {
    const data = await this.prismaService.weather.findMany({
      where: {
        id: 1,
      },
    });
    return data;
  }

  /**
   * 新增Prisma中的weather数据
   */
  public async createWeatherByPrisma(weather: Weather) {
    const data = await this.prismaService.weather.create({
      data: {
        ...weather,
        air_quality_index: weather.air_quality_index?.toString(),
        timestamp: Date.now() / 1000,
      },
    });

    return data;
  }

  /**
   * 调用ai接口查询今日天气情况
   * @param location 查询地点 默认：广东省广州市天河区
   */
  public async getWeatherByAi(location: string = '广东省广州市天河区') {
    const data = await aiService.getWeatherByLocation(location);
    if (!data) return '天气数据异常';
    // 解析数据
    const weatherData = JSON.parse(data || '{}') as Weather;

    // 发送邮件
    const html = `
      <h1>早上好，吴帅</h1>
      <h2>以下是${weatherData.weather_date} ${weatherData.province}${weatherData.area}的天气情况：</h2>

      <p>今天天气: ${weatherData.weather_condition}</p>
      <p>当前温度：${weatherData.temperature}</P>
      <p>温度范围：${weatherData.temperature_range}</p>
      <p>风力信息：${weatherData.wind}</p>
      <p>降水信息：${weatherData.precipitation}</p>
      <p>湿度：${weatherData.humidity}</p>
      <p>空气质量：${weatherData.air_quality}</p>
      <p>空气质量指数：${weatherData.air_quality_index}</p>
      <p>生活建议：${weatherData.live_tips}</p>
      <p>温馨提示：${weatherData.tips}</p>

      <p>以上数据仅供参考，具体情况以实际情况为准。</p>
    `;

    // 发送邮件
    this.emailService.sendEmail('今日天气情况', html);
    // 新增数据到数据库
    this.createWeatherByPrisma(weatherData);

    return data;
  }
}
