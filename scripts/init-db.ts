import { PrismaClient, users } from '@prisma/client';
import * as dotenv from 'dotenv';
const prisma = new PrismaClient();

// 加载环境变量
dotenv.config();

/** 初始化数据库 */
const main = async () => {
  const time = new Date();
  console.log('开始初始化数据库', time);
  const users: users[] = [
    {
      id: 1,
      name: process.env.ADMIN_USERNAME || 'admin',
      email: process.env.SMTP_EMAIL || '123@qq.com',
      image: '',
      province: '广东省',
      area: '广州市天河区',
      created_at: time,
      updated_at: time,
    },
  ];
  for (const user of users) {
    await prisma.users.create({
      data: user,
    });
  }
};

main()
  .then(async () => {
    console.log('初始化数据库成功');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('初始化数据库失败', e);
    await prisma.$disconnect();
    process.exit(1);
  });
