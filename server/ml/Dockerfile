FROM python:3.12-slim

# curl 설치 추가
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# 모델 저장 디렉토리
RUN mkdir -p model

# 애플리케이션 실행 
CMD ["gunicorn", "--workers=4", "--bind", "0.0.0.0:5000", "--worker-class", "uvicorn.workers.UvicornWorker", "app:app"]
