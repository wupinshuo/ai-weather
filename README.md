# AI Weather Service

## 介绍
AI Weather Service 是一个基于人工智能的天气查询服务。它基于DeepSeek-R1 + 火山方舟联网插件，为用户提供智能化的天气信息分析和建议。

### 主要特性
- 智能天气分析
- 精准天气预报
- 个性化穿衣建议
- 未来三天天气预测

## 项目结构
├── api/                           # API工具模块
│   └── ai.ts                      # 火山引擎API封装（天气查询服务）
├── src/                           # 源代码目录
│   ├── app.controller.ts          # 应用程序控制器
│   ├── app.module.ts              # 应用程序主模块
│   ├── app.service.ts             # 应用程序服务
│   ├── main.ts                    # 应用程序入口文件
│   └── weather/                   # 天气模块
│       ├── weather.controller.ts  # 天气控制器
│       ├── weather.module.ts      # 天气模块配置
│       └── weather.service.ts     # 天气服务
│       └── email.service.ts       # 邮件服务
├── tools/                         # 工具模块
│   └── time.ts                    # 时间工具


## 快速开始

### 前置条件
- NodeJs >= 20
- yarn = 1.22.19
- nvm (Node Version Manager)

### 环境配置
1. 克隆项目
```bash
git clone https://github.com/wupinshuo/ai-weather.git
cd ai-weather
```

2. 复制 .env.example 为 .env
```bash
cp .env.example .env
```
3. 配置.env文件
```bash
# 配置火山引擎相关信息

# 邮件配置（默认开启QQ邮箱的SMTP服务）
SMTP_HOST=your_mail_host
SMTP_PORT=your_mail_port
SMTP_EMAIL=your_mail_user
SMTP_PASSWORD=your_mail_pass
IS_OPEN_EMAIL=true
```


### 使用nvmrc配置node版本
```bash
nvm use
```

## 安装依赖
```bash
yarn 
```
## 启动服务（开发环境）
```bash
yarn start:dev
```

# 测试服务是否正常运行
curl localhost:8080/api/v1/hello

# 获取指定地区天气
curl localhost:8080/api/v1/weather
