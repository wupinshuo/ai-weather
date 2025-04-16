/** 打包脚本 */

import { copyFile } from 'fs';

const main = async () => {
  console.log('开始打包');
  // 复制package.json
  await copyFile('package.json', 'build/package.json', () => {});
  await copyFile('pm2.json', 'build/pm2.json', () => {});
  await copyFile('.env', 'build/.env', () => {});
  await copyFile(
    'database-compose.yaml',
    'build/database-compose.yaml',
    () => {},
  );
};

main()
  .then(() => {
    console.log('打包成功');
    process.exit(0);
  })
  .catch((e) => {
    console.error('打包失败', e);
    process.exit(1);
  });
