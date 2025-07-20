import { Body, Controller, Logger, Post } from '@nestjs/common';
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
  @Post()
  async getAllGoldPrices(): Promise<ReturnData<BaseResponse<GoldItem[]>>> {
    try {
      const goldList = await this.goldService.getGoldPrice();
      // 如果goldId为jj，则替换name为“金价”
      if (goldList) {
        goldList.forEach((item) => {
          if (item.goldId === 'jj') {
            item.name = '金价';
          }
        });
      }
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

  /**
   * 查询最近几天某个金价数据
   * @param goldId 金价ID
   * @param days 天数
   * @returns 金价数据列表
   */
  @Post('current')
  async getGoldPriceByDays(
    @Body() body: { goldId: string; days: number },
  ): Promise<ReturnData<BaseResponse<GoldItem[]>>> {
    try {
      const { goldId, days } = body;
      const goldList = await this.goldService.getGoldPriceByDays(goldId, days);
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
