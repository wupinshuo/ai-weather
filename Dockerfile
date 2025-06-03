# 构建阶段
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 设置npm镜像源
RUN npm config set registry https://registry.npmmirror.com

# 安装 pnpm
RUN npm install -g pnpm@9.15.1 --force && pnpm config set registry https://registry.npmmirror.com

# 复制所有项目文件
COPY . .

# 安装依赖
RUN pnpm install --frozen-lockfile

# 构建
RUN pnpm build

# 运行阶段
FROM node:20-alpine AS runner

# 设置工作目录
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm@9.15.1 --force && pnpm config set registry https://registry.npmmirror.com

# 安装时区数据包并设置时区
RUN apk add --no-cache tzdata
ENV TZ Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 从builder阶段复制构建后的产物
COPY --from=builder /app ./

# 端口
EXPOSE 8081

# 启动
CMD ["node", "build/src/main.js"]