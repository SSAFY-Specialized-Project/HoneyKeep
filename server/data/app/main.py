from fastapi import FastAPI
import uvicorn
from app.config import Config
from app.routes import chatbot

app = FastAPI()

# 챗봇 라우터를 "/chatbot" 경로로 등록
app.include_router(chatbot.router, prefix="/chatbot")

if __name__ == "__main__":
    uvicorn.run("app.main:app", host=Config.HOST, port=Config.PORT, reload=True)
