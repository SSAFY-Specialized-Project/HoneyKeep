# config.py
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # FastAPI 실행 관련 설정
    HOST = os.getenv("DATA_HOST", "127.0.0.1")
    PORT = 8081
    
    # OpenAI API Key
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
    
    # 문서 파일 경로
    DOCUMENT_PATH = os.getenv("DOCUMENT_PATH", "./document/documents.txt")
    
    # 텍스트 chunk 관련 설정
    CHUNK_SIZE = 500
    CHUNK_OVERLAP = 50
    
    # Redis 설정
    REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))
    REDIS_DB = int(os.getenv("REDIS_DB", "0"))
    REDIS_PASSWORD = os.getenv("REDIS_PASSWORD", "")
