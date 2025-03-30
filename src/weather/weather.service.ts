import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WeatherService {
  /**
   * 调用ai接口查询今日天气情况
   * @param location 查询地点 默认：广东省广州市天河区
   */
  public async getWeatherByAi(location: string = '广东省广州市天河区') {
    console.log('查询天气开始');
    const startTime = Date.now();
    // api-key
    const apiKey = process.env.ARK_API_KEY;
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
     "tips": <生活建议 要多维度，详细一点 如：出门带伞>
     "tips_2": <温馨提示 如：未来几天番禺区将持续阴雨天气，气温较低，请适时增减衣物>
     "future_weather": <未来三天的大概天气预计（不包括今天），如3月5日天气:...,3月6日天气:...,3月7日天气:...>
    }
    '''
    `;
    /** baseUrl */
    const baseUrl = process.env.ARK_BOT_BASE_URL;
    /** 模型 */
    const model = process.env.ARK_MODEL;

    // 参数校验
    if (!apiKey || !baseUrl || !model) {
      throw new Error('AI相关参数校验失败，请检查配置');
    }
    /** 请求头 */
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    };
    /** 请求体 */
    const data = {
      model,
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: queryContent },
      ],
      stream: false,
    };
    /** 请求 */
    try {
      const res = await axios.post(baseUrl, data, { headers });
      // console.log('查询天气成功', res.data);
      const endTime = Date.now();
      console.log('查询天气耗时', endTime - startTime, 'ms');

      // 处理数据
      const message: string = res.data?.choices?.[0]?.message?.content ?? '';
      console.log('天气数据', message);
      // 提取出 ```json 与 ``` 之间的数据
      const messageData =
        message.match(/```json([\s\S]*)```/)?.[1]?.trim() || '';
      console.log('匹配的天气数据', messageData);
      return messageData;
    } catch (error) {
      console.error('查询天气失败:', error);
      return null;
    }
  }
}
