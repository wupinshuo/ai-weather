# AI Weather Service

## 介绍
AI Weather Service 是一个基于人工智能的天气查询服务。它基于火山引擎的大语言模型，为用户提供智能化的天气信息分析和建议。

### 主要特性
- 智能天气分析
- 精准天气预报
- 个性化穿衣建议
- 未来三天天气预测

## 项目结构
api/                # API工具模块
--- ai.ts           # 火山引擎API封装（天气查询服务）
src/
├── app.module.ts        # 应用程序主模块
├── main.ts             # 应用程序入口文件
└── weather/            # 天气模块
    ├── weather.controller.ts
    ├── weather.module.ts
    └── weather.service.ts
tools/                  # 工具模块
--- time.ts            # 时间工具



## 快速开始

### 前置条件
- NodeJs >= 20
- yarn = 1.22.19
- nvm (Node Version Manager)

### 环境配置
1. 克隆项目
```bash
git clone <repository-url>
cd ai-weather
```

复制 .env.example 为 .env

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
