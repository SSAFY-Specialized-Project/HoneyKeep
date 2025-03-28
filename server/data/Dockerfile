# (1) 베이스 이미지 지정
FROM python:3.12

# (2) 작업 디렉토리 설정
WORKDIR /app

# (3) requirements.txt 복사 및 패키지 설치
COPY ../requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# (4) 애플리케이션 소스 복사 (예: app 폴더)
COPY ../app ./app

# (5) documents.txt 복사 (필요하다면)
COPY document/documents.txt ./

# (6) 애플리케이션 실행
CMD ["python", "-m", "app.main"]
