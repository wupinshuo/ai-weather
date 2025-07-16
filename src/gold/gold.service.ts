import { Injectable, Logger } from '@nestjs/common';
import { GoldItem } from 'types/gold';
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
        <p>周大福金价: ${goldList.find((item) => item.goldId === 'zdf')?.price} 元/克</p>
      </div>
    `;

    // 发送邮件
    this.emailService.sendEmail('今日金价情况', html, '1981928991@qq.com');

    // 新增数据到数据库
    await this.saveGoldPrice(goldList);

    return goldList;
  }

  /**
   * 查询最近七天某个金价数据
   * @param goldId 金价ID
   * @returns 金价数据列表
   */
  public async getGoldPriceBySevenDays(goldId: string): Promise<GoldItem[]> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const goldList = await this.prismaService.gold.findMany({
      where: { gold_id: goldId, time: { gte: sevenDaysAgo } },
      orderBy: { time: 'desc' },
    });

    if (!goldList || goldList.length === 0) return [];

    // 处理数据，保证每天只有一条数据
    const result = goldList.reduce((acc, item) => {
      const date = item.time.toISOString().split('T')[0];
      if (!acc[date]) {
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
}
