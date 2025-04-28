# 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

# 设置npm镜像源
RUN npm config set registry https://registry.npmmirror.com
RUN yarn config set registry https://registry.npmmirror.com

RUN npm install -g yarn@1.22.19 --force

# 只复制依赖相关文件
COPY package.json yarn.lock tsconfig.json ./
COPY prisma ./prisma

# 安装依赖
RUN yarn install --frozen-lockfile

# 构建
RUN yarn build:docker

# 运行阶段
FROM node:20-alpine AS runner

# 设置工作目录
WORKDIR /app

# 安装指定版本的yarn
RUN npm install -g yarn@1.22.19 --force

# 先复制 node_modules
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build

COPY package*.json ./
COPY yarn.lock ./
COPY prisma ./prisma

# 再复制其他源码
COPY . .

EXPOSE 8081

CMD ["node", "build/src/main.js"] 