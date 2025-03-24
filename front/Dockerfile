# 1단계: 빌드
FROM node:20.9.0-alpine AS build

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# 2단계: 실행
FROM node:20.9.0-alpine

RUN npm install -g serve
WORKDIR /app
COPY --from=build /app/dist ./dist

EXPOSE 3000
ENTRYPOINT ["serve", "-s", "dist", "-l", "tcp://0.0.0.0:3000"]
