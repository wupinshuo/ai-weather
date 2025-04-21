# 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

# 设置npm镜像源
RUN npm config set registry https://registry.npmmirror.com

RUN npm install -g yarn@1.22.19 --force

COPY package*.json ./
COPY yarn.lock ./
# COPY .env ./
COPY prisma ./prisma

RUN yarn install

COPY . .

RUN yarn build:docker

# 运行阶段
FROM node:20-alpine

WORKDIR /app

# 安装指定版本的yarn
RUN npm install -g yarn@1.22.19 --force

COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
COPY yarn.lock ./
# COPY .env ./
COPY prisma ./prisma

EXPOSE 8081

CMD ["node", "build/src/main.js"] 