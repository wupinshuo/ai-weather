import { Controller, Get, Logger } from '@nestjs/common';
import { GoldService } from './gold.service';
import { GoldItem } from 'types/gold';
import { BaseResponse, ReturnData } from 'types/base';

@Controller('gold')
export class GoldController {
  private readonly logger = new Logger(GoldController.name);

  constructor(private readonly goldService: GoldService) {}

  /**
   * 获取所有金价数据
   * @returns 金价数据列表
   */
  @Get()
  async getAllGoldPrices(): Promise<ReturnData<BaseResponse<GoldItem[]>>> {
    try {
      const goldList =
        await this.goldService.getGoldPriceByAiPushEmailAndSave();
      return {
        status: 200,
        message: '获取金价数据成功',
        data: goldList,
      };
    } catch (error) {
      this.logger.error(`获取金价数据失败: ${error.message}`);
      return {
        status: 500,
        message: '获取金价数据失败',
        data: null,
      };
    }
  }
}
