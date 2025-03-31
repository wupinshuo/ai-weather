import axios from 'axios';
import * as dotenv from 'dotenv';
import { timeTool } from 'tools/time-tool';

// 读取环境变量
dotenv.config();

class AiService {
  /** ai base url */
  private baseUrl = process.env.ARK_BOT_BASE_URL as string;
  /** ai api key */
  private apiKey = process.env.ARK_API_KEY as string;
  /** ai model */
  private model = process.env.ARK_MODEL as string;

  /** ai 天气服务 */
  public aiWeatherService = axios.create({
    baseURL: this.baseUrl,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    },
  });

  /**
   * @description: 获取天气信息
   * @param {string} location 位置 如：广东省广州市天河区
   * @return {string} 天气信息
   */
  public async getWeatherByLocation(
    location: string = '广东省广州市天河区',
  ): Promise<string> {
    // 参数校验
    if (!this.baseUrl || !this.apiKey || !this.model) {
      throw new Error('请检查环境变量是否配置正确');
    }
    // 记录开始时间(毫秒)
    const startTime = Date.now();

    console.log(
      '开始查询天气, 位置: %s, 时间: %s',
      location,
      new Date(startTime),
    );

    /** 查询内容 */
    const queryContent = `请查询中国${location}今天的天气情况`;
    /** prompt提示词 */
    const prompt = `
        你是一个天气助手，能够根据用户的需求查询天气信息并返回规范的 JSON 格式数据。格式如下：
        
        '''json
        {
         "location": <查询地点 如：广东省广州市天河区>,
         "time": <查询时间 如：2025年03月04日>,
         "weather_condition": <天气状况 如：晴>,
         "temperature": <当前温度 如：25℃>,
         "temperature_range": <温度范围 如：20℃ - 30℃>,
         "wind": <风力信息 如：东风3级>,
         "precipitation": <降水信息 如：小雨>,
         "humidity": <湿度 如：50%>,
         "air_quality": <空气质量 如：良>,
         "air_quality_index": <空气质量指数 如：50>,
         "tips": <生活建议 要多维度，详细一点 如：出门带伞>,
         "tips_2": <温馨提示 如：未来几天番禺区将持续阴雨天气，气温较低，请适时增减衣物>
         "future_weather": <未来三天的大概天气预计（不包括今天），如3月5日天气:...,3月6日天气:...,3月7日天气:...>
        }
        '''
        `;
    /** 请求体 */
    const data = {
      model: this.model,
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: queryContent },
      ],
      stream: false,
    };

    try {
      const res = await this.aiWeatherService.post(
        '/api/v3/bots/chat/completions',
        data,
      );
      const endTime = Date.now();
      console.log(
        '查询天气耗时: ',
        timeTool.formatDuration(endTime - startTime),
      );
      // 接口返回数据
      const message: string = res.data?.choices?.[0]?.message?.content ?? '';
      console.log('原始天气数据', message);

      // 提取出 ```json 与 ``` 之间的数据
      const messageData =
        message.match(/```json([\s\S]*)```/)?.[1]?.trim() || '';
      console.log('解析出的天气数据', messageData);
      return messageData;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return '';
    }
  }
}

export const aiService = new AiService();
