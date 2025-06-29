import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { GoldService } from 'src/gold/gold.service';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);
  public constructor(private readonly goldService: GoldService) {}

  onModuleInit() {
    this.logger.log('定时任务已初始化');
  }

  /** 每天早上9点05分更新金价 */
  @Cron('0 05 09 * * *')
  public async updateGoldPrice() {
    this.logger.log('开始更新金价');
    await this.goldService.getGoldPriceByAiPushEmailAndSave();
    this.logger.log('金价更新完成');
  }
}
