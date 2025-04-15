import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { BaseResponse } from 'types/base';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * 通过用户ID查询用户信息
   * @param userId 用户ID
   * @returns 用户信息
   */
  public async getUserById(userId: string): Promise<BaseResponse<User>> {
    if (!userId) return null;
    const userIdNum = Number(userId);
    if (isNaN(userIdNum)) return null;
    const data = await this.prismaService.user.findFirst({
      where: {
        id: userIdNum,
      },
    });
    return data;
  }

  /**
   * 添加用户
   * @param user 用户信息
   * @returns 添加结果
   */
  public async createUser(user: Omit<User, 'id'>): Promise<BaseResponse<User>> {
    if (!user) return null;

    const data = await this.prismaService.user.create({
      data: user,
    });
    return data;
  }
}
