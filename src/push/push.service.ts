import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WeatherService } from '../weather/weather.service';
import { Cron } from '@nestjs/schedule';
import { timeTool } from '../../tools/time-tool';

@Injectable()
export class PushService implements OnModuleInit {
  private readonly logger = new Logger(PushService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly weatherService: WeatherService,
  ) {}

  onModuleInit() {
    this.logger.log('推送服务已初始化');
  }

  /**
   * 每半小时检查一次是否有需要推送的用户
   * 每30分钟运行一次（秒 分 时 日 月 周）
   */
  @Cron('0 */30 * * * *')
  async checkPushTasks() {
    this.logger.debug('检查定时推送任务');

    // 获取当前北京时间
    const now = timeTool.getChinaTimeDate();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // 计算当前半小时区间
    const halfHourInterval = currentMinute < 30 ? '00' : '30';
    const currentTimePrefix = `${currentHour.toString().padStart(2, '0')}:${halfHourInterval}`;

    this.logger.log(
      `当前时间：${now}, currentTimePrefix: ${currentTimePrefix}`,
    );
    try {
      // 查找所有启用了推送且推送时间在当前半小时区间内的设置
      const pushSettingsToNotify =
        await this.prismaService.weatherPushSetting.findMany({
          where: {
            enablePush: true,
            pushTime: {
              startsWith: currentTimePrefix,
            },
          },
          include: {
            user: true,
          },
        });

      this.logger.log(
        `找到 ${pushSettingsToNotify.length} 个推送设置需要在本半小时内执行`,
      );

      // 为匹配的设置执行推送任务调度
      await this.scheduleUserPushTasks(pushSettingsToNotify);
    } catch (error) {
      this.logger.error('定时推送任务执行失败', error);
    }
  }

  /**
   * 为用户调度推送任务
   * @param pushSettings 需要推送的设置列表
   */
  private async scheduleUserPushTasks(pushSettings: any[]) {
    if (!pushSettings || pushSettings.length === 0) return;

    const now = timeTool.getChinaTimeDate();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    for (const setting of pushSettings) {
      try {
        const user = setting.user;
        if (!user || !user.email || !setting.pushTime) continue;

        this.logger.log(`调度用户 ${user.id} 的推送任务为 ${setting}`);

        // 解析推送时间
        const [hourStr, minuteStr] = setting.pushTime.split(':');
        const pushHour = parseInt(hourStr, 10);
        const pushMinute = parseInt(minuteStr, 10);

        // 如果推送时间小时匹配当前小时，且分钟在当前半小时区间内，或者上次推送时间不是今天
        if (
          pushHour === currentHour &&
          ((currentMinute < 30 && pushMinute < 30) ||
            (currentMinute >= 30 && pushMinute >= 30)) &&
          !this.isPushedToday(setting.lastPushAt)
        ) {
          // 计算延迟时间（毫秒）
          const delayMs = (pushMinute - currentMinute) * 60 * 1000;

          // 使用setTimeout调度延迟执行的推送任务
          this.logger.debug(
            `调度用户 ${user.id} 的推送任务，延迟 ${delayMs}ms 后执行`,
          );

          setTimeout(
            async () => {
              // 再次检查，避免重复推送
              const updatedSetting =
                await this.prismaService.weatherPushSetting.findUnique({
                  where: { id: setting.id },
                });

              if (
                updatedSetting &&
                !this.isPushedToday(updatedSetting.lastPushAt)
              ) {
                await this.pushWeatherToUser(user.id);
                // 更新推送设置的最后推送时间
                await this.prismaService.weatherPushSetting.update({
                  where: { id: setting.id },
                  data: { lastPushAt: timeTool.getChinaTimeDate() },
                });
              } else {
                this.logger.debug(`用户 ${user.id} 今天已经推送过天气信息`);
              }
            },
            Math.max(0, delayMs),
          );
        }
      } catch (error) {
        this.logger.error(`为用户 ${setting.user?.id} 调度推送任务失败`, error);
      }
    }
  }

  /**
   * 判断上次推送时间是否为今天
   * @param lastPushAt 上次推送时间
   * @returns 是否今天已推送过
   */
  private isPushedToday(lastPushAt: Date | null): boolean {
    if (!lastPushAt) return false;

    const now = timeTool.getChinaTimeDate();
    const lastPush = timeTool.getChinaTimeDate(lastPushAt);

    return (
      lastPush.getFullYear() === now.getFullYear() &&
      lastPush.getMonth() === now.getMonth() &&
      lastPush.getDate() === now.getDate()
    );
  }

  /**
   * 推送天气信息给指定用户
   * @param userId 用户ID
   */
  async pushWeatherToUser(userId: number) {
    try {
      // 获取用户信息
      const user = await this.prismaService.user.findUnique({
        where: { id: userId },
      });

      if (!user || !user.email || !user.province || !user.area) {
        this.logger.warn(`用户 ${userId} 信息不完整，无法推送天气`);
        return false;
      }

      // 获取用户所在地区的天气信息
      const location = `${user.province}${user.area}`;
      const weatherData =
        await this.weatherService.getWeatherByAiSendEmailAndSave(location);
      return weatherData;
    } catch (error) {
      this.logger.error(`向用户 ${userId} 推送天气信息失败`, error);
      return false;
    }
  }

  /**
   * 设置用户的推送设置
   * @param userId 用户ID
   * @param enablePush 是否启用推送
   * @param pushTime 推送时间
   */
  async setPushSetting(userId: number, enablePush: boolean, pushTime: string) {
    try {
      this.logger.log(`设置用户 ${userId} 的推送设置`, {
        enablePush,
        pushTime,
      });
      // 先查找是否存在相同的设置
      const existingSetting =
        await this.prismaService.weatherPushSetting.findFirst({
          where: {
            userId,
            pushTime,
          },
        });

      let setting;
      if (existingSetting) {
        // 如果存在则更新
        setting = await this.prismaService.weatherPushSetting.update({
          where: { id: existingSetting.id },
          data: { enablePush },
        });
      } else {
        // 如果不存在则创建
        setting = await this.prismaService.weatherPushSetting.create({
          data: {
            userId,
            enablePush,
            pushTime,
          },
        });
      }

      return setting;
    } catch (error) {
      this.logger.error(`设置用户 ${userId} 的推送设置失败`, error);
      return null;
    }
  }

  /**
   * 获取用户的所有推送设置
   */
  async getUserPushSettings(userId: number) {
    try {
      this.logger.log(`获取用户 ${userId} 的推送设置`);
      // 获取用户信息
      const user = await this.prismaService.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          province: true,
          area: true,
        },
      });

      this.logger.log(`获取用户 ${userId} 信息成功`, user);
      // 获取用户的推送设置
      const pushSettings = await this.prismaService.weatherPushSetting.findMany(
        {
          where: { userId },
          select: {
            id: true,
            enablePush: true,
            pushTime: true,
            lastPushAt: true,
          },
        },
      );

      this.logger.log(`获取用户 ${userId} 推送设置成功`, pushSettings);
      return {
        user,
        pushSettings,
      };
    } catch (error) {
      this.logger.error(`获取用户 ${userId} 的推送设置失败`, error);
      return null;
    }
  }
}
