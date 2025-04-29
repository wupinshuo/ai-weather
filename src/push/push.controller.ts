import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { PushService } from './push.service';

@Controller('push')
export class PushController {
  constructor(private readonly pushService: PushService) {}

  /**
   * 获取用户的推送设置
   */
  @Get('settings/:userId')
  async getPushSettings(@Param('userId') userId: string) {
    const userIdNum = parseInt(userId, 10);
    if (isNaN(userIdNum)) {
      return { success: false, message: '无效的用户ID' };
    }

    const settings = await this.pushService.getUserPushSettings(userIdNum);
    if (!settings) {
      return { success: false, message: '获取推送设置失败' };
    }

    return { success: true, data: settings };
  }

  /**
   * 设置用户的主推送设置
   */
  @Put('settings/:userId')
  async updatePushSetting(
    @Param('userId') userId: string,
    @Body() body: { enablePush: boolean; pushTime: string },
  ) {
    const userIdNum = parseInt(userId, 10);
    if (isNaN(userIdNum)) {
      return { success: false, message: '无效的用户ID' };
    }

    const { enablePush, pushTime } = body;

    // 验证推送时间格式
    if (pushTime && !/^([01]\d|2[0-3]):([0-5]\d)$/.test(pushTime)) {
      return { success: false, message: '无效的推送时间格式，请使用HH:mm格式' };
    }

    const result = await this.pushService.setPushSetting(
      userIdNum,
      enablePush,
      pushTime,
    );

    if (!result) {
      return { success: false, message: '设置推送失败' };
    }

    return { success: true, data: result };
  }

  /**
   * 手动推送天气信息
   */
  @Post('manual/:userId')
  async manualPush(@Param('userId') userId: string) {
    const userIdNum = parseInt(userId, 10);
    if (isNaN(userIdNum)) {
      return { success: false, message: '无效的用户ID' };
    }

    const result = await this.pushService.pushWeatherToUser(userIdNum);

    if (!result) {
      return { success: false, message: '推送失败' };
    }

    return { success: true, message: '推送成功' };
  }
}
