import axios from 'axios';
import * as dotenv from 'dotenv';
import { timeTool } from '../tools/time-tool';
import { Logger } from '@nestjs/common';

// 读取环境变量
dotenv.config();

class AiService {
  private logger = new Logger(AiService.name);

  /** ai base url */
  private baseUrl = process.env.ARK_BOT_BASE_URL as string;
  /** ai api key */
  private apiKey = process.env.ARK_API_KEY as string;
  /** ai model */
  private model = process.env.ARK_MODEL as string;

  /** deepseek ai 服务 */
  public deepseekAiService = axios.create({
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

    this.logger.log(
      '开始查询天气, 位置: %s, 时间: %s',
      location,
      new Date(startTime),
    );

    /** 查询内容 */
    const queryContent = `请查询中国${location}今天的天气情况`;
    /** prompt提示词 */
    const prompt = `
        你是一个天气助手，能够根据用户的需求查询天气信息并返回规范的 JSON 格式数据，如果有某一项数据为空，则返回空字符串，不需要在json格式中添加额外的注释。格式如下：
        
        '''json
        {
         "province": <查询省份 如：广东省>,
         "area": <查询区 广州市天河区>,
         "weather_date": <查询日期 如：2025-08-01>,
         "weather_condition": <天气状况 如：晴>,
         "temperature": <当前温度 如：25℃>,
         "temperature_range": <温度范围 如：20℃ - 30℃>,
         "wind": <风力信息 如：东风3级>,
         "precipitation": <降水信息 如：小雨>,
         "humidity": <湿度 如：50%>,
         "air_quality": <空气质量 如：良>,
         "air_quality_index": <空气质量指数 如：50>,
         "live_tips": <生活建议 要多维度，详细一点 如：出门带伞>,
         "tips": <温馨提示 如：未来几天番禺区将持续阴雨天气，气温较低，请适时增减衣物>
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
      const res = await this.deepseekAiService.post(
        '/api/v3/bots/chat/completions',
        data,
      );
      const endTime = Date.now();
      this.logger.log(
        '查询天气耗时: ',
        timeTool.formatDuration(endTime - startTime),
      );
      // 接口返回数据
      const message: string = res.data?.choices?.[0]?.message?.content ?? '';
      this.logger.log('原始天气数据', message);

      // 提取出 ```json 与 ``` 之间的数据
      const messageData =
        message.match(/```json([\s\S]*)```/)?.[1]?.trim() || '';
      this.logger.log('解析出的天气数据', messageData);
      return messageData;
    } catch (error) {
      this.logger.error('Error fetching weather data:', error);
      return '';
    }
  }

  /**
   * @description: 获取每日一签信息
   * @return {string} 每日一签信息
   */
  public async getDailySign(): Promise<string> {
    /** prompt提示词 */
    const prompt = `
    你是一位精通周易与古典诗词的签文大师，能够根据用户输入的日期，生成一条符合以下要求的每日签文：

【格式要求】
1. 签文主体：原创或改编自经典诗词的2句或者4句对仗诗句（7言或5言）
2. 解读部分：包含3个要素（今日运势关键词 + 具体建议 + 文化典故出处提示）
3. 风格：保持唐代签诗风格，用词典雅含蓄

【内容要素】
- 运势方向：{{随机选择: 事业/姻缘/健康/财运/人际}}
- 意象元素：{{随机选择2-3个: 明月/松柏/鲲鹏/锦鲤/莲花/鸿雁/金鳞/瑶琴}}
- 节气关联：{{当前节气}}（如非重要节气则忽略）

【输出示例】
 '''json
        {
         "sign": <签文 如：玉露金风逢吉日，云开月朗照前程>,
         "explain": <签文解读 如：此签寓意着在金风玉露的时节，云开月朗，预示着前程光明，适合积极行动，把握机遇。>,
         "fortune": <运势 如：事业通达>,
         "tip": <建议 如：宜决策新项目，忌犹豫不决>,
         "source": <典出 如：《淮南子》"时之反侧，间不容息">,
         "season": <节气 如：霜降>,
         "date": <日期 如：2025-06-03>
        }
        '''
    `;

    // 获取当前日期
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dateStr = `${year}-${month}-${day}`;

    /** 请求体 */
    const data = {
      model: this.model,
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: dateStr },
      ],
      stream: false,
      temperature: 0.7,
      max_tokens: 200,
    };

    try {
      const res = await this.deepseekAiService.post(
        '/api/v3/bots/chat/completions',
        data,
      );
      // 接口返回数据
      const message: string = res.data?.choices?.[0]?.message?.content ?? '';
      this.logger.log('原始每日一签数据', message);

      // 提取出 ```json 与 ``` 之间的数据
      const messageData =
        message.match(/```json([\s\S]*)```/)?.[1]?.trim() || '';
      this.logger.log('解析出的每日一签数据', messageData);
      return messageData;
    } catch (error) {
      this.logger.error('Error fetching daily sign:', error);
      return '';
    }
  }
}

export const aiService = new AiService();
