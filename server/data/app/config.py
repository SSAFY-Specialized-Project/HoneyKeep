# config.py
import os

class LocalConfig:
    # 로컬 환경 설정
    HOST = "127.0.0.1"
    PORT = 8085

class ProdConfig:
    # 배포 환경 설정
    HOST = "0.0.0.0"
    PORT = 8081

# 환경 변수에 따라 설정 선택
def get_config():
    env = os.getenv("PYTHON_ENV", "local")  # 환경변수가 없으면 'local'이 기본값
    if env == "prod":
        return ProdConfig
    return LocalConfig
