import * as dotenv from 'dotenv';
// 读取环境变量
dotenv.config();

/** 自定义开关装饰器 */

// 解读：运用了类装饰器，它会遍历类的所有属性和方法。如果属性是一个方法且不是构造函数，它会用一个新的函数来替换这个方法。新的函数会根据环境变量配置 来决定是否调用实际的方法。

/** 基础开关装饰器 */
function BASEEnabled(envVarName: string) {
  return function (target: new (...args: any[]) => object) {
    for (const propertyName of Object.getOwnPropertyNames(target.prototype)) {
      const method = target.prototype[propertyName];
      if (typeof method === 'function' && propertyName !== 'constructor') {
        target.prototype[propertyName] = async function (...args: any[]) {
          if (process.env[envVarName] === 'true') {
            return await method.apply(this, args);
          } else {
            console.log(
              `${propertyName} skipped because ${envVarName} is false`,
            );
            return;
          }
        };
      }
    }
  };
}

/** 邮件开关装饰器 */
export const EmailEnabled = BASEEnabled('EMAIL_ENABLED');
