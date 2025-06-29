import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { BaseResponse, ReturnData } from 'types/base';
import { users } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:userId')
  public async getUserById(
    @Param('userId') userId: string,
  ): Promise<ReturnData<BaseResponse<users>>> {
    try {
      const user = await this.userService.getUserById(userId);
      if (!user) {
        return {
          status: 200,
          code: 404,
          data: null,
          message: '用户不存在',
        };
      }
      return {
        status: 200,
        code: 200,
        data: user,
        message: 'success',
      };
    } catch (error) {
      return {
        status: 500,
        code: 500,
        data: null,
        message: error.message,
      };
    }
  }

  @Post('/create')
  public async createUser(
    @Body() body: Omit<users, 'id'>,
  ): Promise<ReturnData<BaseResponse<users>>> {
    try {
      console.log('新增用户信息', body);
      // 参数校验
      if (!body.email || !body.name || !body.province || !body.area) {
        return {
          status: 400,
          code: 400,
          data: null,
          message: '参数错误',
        };
      }
      const user = await this.userService.createUser(body);
      if (!user) {
        return {
          status: 500,
          code: 404,
          data: null,
          message: '创建用户失败',
        };
      }
      return {
        status: 200,
        code: 200,
        data: user,
        message: 'success',
      };
    } catch (error) {
      return {
        status: 500,
        code: 500,
        data: null,
        message: error.message,
      };
    }
  }
}
