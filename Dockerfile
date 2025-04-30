# 设置默认构建平台
ARG TARGETPLATFORM=linux/amd64

# 构建阶段
FROM --platform=$TARGETPLATFORM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 设置npm镜像源
RUN npm config set registry https://registry.npmmirror.com
RUN yarn config set registry https://registry.npmmirror.com

# 安装yarn
RUN npm install -g yarn@1.22.19 --force

# 复制所有项目文件
COPY . .

# 安装依赖
RUN yarn install --frozen-lockfile

# 构建
RUN yarn build:docker

# 运行阶段
FROM --platform=$TARGETPLATFORM node:20-alpine AS runner

# 设置工作目录
WORKDIR /app

# 安装指定版本的yarn
RUN npm install -g yarn@1.22.19 --force

# 安装时区数据包并设置时区
RUN apk add --no-cache tzdata
ENV TZ Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 复制构建产物和必要文件
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

# 端口
EXPOSE 8081

# 启动
CMD ["node", "build/src/main.js"]