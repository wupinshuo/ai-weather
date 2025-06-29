import axios from 'axios';
import * as dotenv from 'dotenv';
import { BaseResponse } from 'types/base';
import { GoldItem } from 'types/gold';
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
}

export const dataHarvester = new DataHarvester();
