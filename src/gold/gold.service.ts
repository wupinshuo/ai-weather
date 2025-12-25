import { Injectable, Logger } from '@nestjs/common';
import { GoldItem, GoldHistoryResponse } from 'types/gold';
import { BaseResponse } from 'types/base';
import { dataHarvester } from 'api/data-harvester';
import { timeTool } from 'tools/time-tool';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../tools/email.service';

@Injectable()
export class GoldService {
  private readonly logger = new Logger(GoldService.name);
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  onModuleInit() {
    this.logger.log('金价服务已初始化');
  }

  /**
   * 新增金价数据到数据库
   * @param goldList 金价数据列表
   */
  public async saveGoldPrice(goldList: GoldItem[]) {
    try {
      const time = timeTool.getChinaTimeDate();
      this.logger.log(`新增金价时间: ${time}`);
      await this.prismaService.gold.createMany({
        data: goldList.map((item) => ({
          gold_id: item.goldId,
          time,
          name: item.name,
          price: item.price,
        })),
      });
    } catch (error) {
      this.logger.error(`新增金价数据失败: ${error.message}`, error.stack);
      return null;
    }
  }

  /**
   * 获取金价数据
   * @returns 金价数据列表
   */
  public async getGoldPrice(): Promise<BaseResponse<GoldItem[]>> {
    try {
      const goldList = await dataHarvester.getGoldPrice();
      return goldList;
    } catch (error) {
      this.logger.error(`获取金价数据失败: ${error.message}`, error.stack);
      return null;
    }
  }

  /**
   * 调用接口查询今日金价情况, 发送邮件并保存到数据库
   */
  public async getGoldPriceByAiPushEmailAndSave(): Promise<
    BaseResponse<GoldItem[]>
  > {
    const goldList = await this.getGoldPrice();
    if (!goldList) return null;

    const html = `
      <div>
        <h1>今日金价情况</h1>
        <p>今日金价: ${goldList.find((item) => item.goldId === 'jj')?.price} 元/克</p>
      </div>
    `;

    // 批量发送邮件
    this.emailService.sendBatchEmails('今日金价情况', html);

    // 新增数据到数据库
    await this.saveGoldPrice(goldList);

    return goldList;
  }

  /**
   * 查询最近几天某个金价数据
   * @param goldId 金价ID
   * @param days 天数 默认7天
   * @returns 金价数据列表
   */
  public async getGoldPriceByDays(
    goldId: string,
    days: number = 7,
  ): Promise<GoldItem[]> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - days);

    const goldList = await this.prismaService.gold.findMany({
      where: { gold_id: goldId, time: { gte: sevenDaysAgo } },
      orderBy: { time: 'desc' },
    });

    if (!goldList || goldList.length === 0) return [];

    // 处理数据，保证每天只有一条数据
    const result = goldList.reduce((acc, item) => {
      const date = item.time.toISOString().split('T')[0];
      if (!acc[date]) {
        // 如果goldId为jj，则替换name为"金价"
        if (item.gold_id === 'jj') {
          item.name = '金价';
        }
        acc[date] = {
          goldId: item.gold_id,
          name: item.name,
          price: item.price,
          time: item.time,
        };
      }
      return acc;
    }, {});

    return Object.values(result);
  }

  /**
   * 更新今日最高金价
   * 查询今日最高金价并更新数据库中今天的最新"今日金价"(goldId='jj')记录
   */
  public async updateTodayHighestGoldPrice(): Promise<void> {
    try {
      // 获取今日最高金价
      const highestPrice = await dataHarvester.getTodayHighestGoldPrice();
      if (!highestPrice) {
        this.logger.error('获取今日最高金价失败');
        return;
      }

      // 获取今天的日期范围（当天 00:00:00 到 23:59:59）
      const today = timeTool.getChinaTimeDate();
      const startOfDay = new Date(today);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);

      // 查找今天的最新"今日金价"记录
      const todayGoldRecord = await this.prismaService.gold.findFirst({
        where: {
          gold_id: 'jj',
          time: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        orderBy: {
          time: 'desc',
        },
      });

      if (!todayGoldRecord) {
        this.logger.warn('未找到今天的金价记录');
        return;
      }

      // 更新最高金价
      await this.prismaService.gold.update({
        where: { id: todayGoldRecord.id },
        data: { price: highestPrice },
      });

      this.logger.log(
        `成功更新今日最高金价: ${highestPrice} 元/克 (记录ID: ${todayGoldRecord.id})`,
      );
    } catch (error) {
      this.logger.error(`更新今日最高金价失败: ${error.message}`, error.stack);
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
      const historyData = await dataHarvester.getGoldPriceHistory(days);
      return historyData;
    } catch (error) {
      this.logger.error(
        `查询${days}天历史金价数据失败: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }
}
