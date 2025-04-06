# 1단계: 빌드
FROM node:22.12.0-alpine AS build

# 빌드 시점에 환경 변수를 받을 수 있도록 ARG 추가
ARG VITE_BASE_URL
ENV VITE_BASE_URL=$VITE_BASE_URL

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# 2단계: 실행
FROM node:22.12.0-alpine

RUN npm install -g serve
WORKDIR /app
COPY --from=build /app/dist ./dist

EXPOSE 3000
ENTRYPOINT ["serve", "-s", "dist", "-l", "tcp://0.0.0.0:3000"]
