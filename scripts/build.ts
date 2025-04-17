/** 打包脚本 */

import { copyFile, mkdir } from 'fs/promises';
import path from 'path';

const main = async () => {
  try {
    console.log('开始构建');
    await copyFile('package.json', 'build/package.json');
    await copyFile('yarn.lock', 'build/yarn.lock');
    await copyFile('pm2.json', 'build/pm2.json');
    await copyFile('.env', 'build/.env');
    await copyFile('docker-compose.yaml', 'build/docker-compose.yaml');

    // 确保目标目录存在
    await mkdir('build/prisma', { recursive: true });

    await copyFile('prisma/schema.prisma', 'build/prisma/schema.prisma');
    console.log('构建完成');
    process.exit(0);
  } catch (error) {
    console.error('构建失败:', error);
    process.exit(1);
  }
};

main();
