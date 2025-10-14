import axios from 'axios';
import * as dotenv from 'dotenv';
import { BaseResponse } from 'types/base';
import { GoldItem, GoldHistoryResponse } from 'types/gold';
import { timeTool } from '../tools/time-tool';
import { Logger } from '@nestjs/common';

// 读取环境变量
dotenv.config();

class DataHarvester {
  private baseUrl = process.env.DATA_HARVESTER_URL as string;
  private logger = new Logger(DataHarvester.name);

  public async getGoldPrice(): Promise<BaseResponse<GoldItem[]>> {
    try {
      const time = Date.now();
      const response = await axios.get(
        `${this.baseUrl}/api/v1/api-data/gold-price`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      this.logger.log(
        `获取金价数据成功, 耗时: ${timeTool.formatDuration(Date.now() - time)}`,
      );
      return response.data?.data?.list || [];
    } catch (error) {
      this.logger.error('获取金价数据失败', error);
      return null;
    }
  }

  /**
   * 获取今日最高金价
   * @returns 今日最高金价
   */
  public async getTodayHighestGoldPrice(): Promise<number | null> {
    try {
      const time = Date.now();
      const response = await axios.get(
        `${this.baseUrl}/api/v1/api-data/gold-price/today-highest`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      this.logger.log(
        `获取今日最高金价成功, 耗时: ${timeTool.formatDuration(Date.now() - time)}`,
      );
      return response.data?.data || null;
    } catch (error) {
      this.logger.error('获取今日最高金价失败', error);
      return null;
    }
  }

  /**
   * 查询历史金价数据（只返回"今日金价"）
   * @param days 查询天数（1/3/7）
   * @returns 历史金价数据
   */
  public async getGoldPriceHistory(
    days: number,
  ): Promise<GoldHistoryResponse | null> {
    try {
      const time = Date.now();
      const response = await axios.post(
        `${this.baseUrl}/api/v1/api-data/gold-price/history`,
        { days },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      this.logger.log(
        `查询${days}天历史金价数据成功, 耗时: ${timeTool.formatDuration(Date.now() - time)}`,
      );
      return response.data?.data || null;
    } catch (error) {
      this.logger.error(`查询${days}天历史金价数据失败`, error);
      return null;
    }
  }
}

export const dataHarvester = new DataHarvester();
