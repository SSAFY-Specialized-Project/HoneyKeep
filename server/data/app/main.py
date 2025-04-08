from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from app.config import Config
from app.routes import chatbot

app = FastAPI()

origins = [
    "https://j12a405.p.ssafy.io",
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["Set-Cookie"],
    allow_credentials=True,
    max_age=3600
)

# 챗봇 라우터를 "/chatbot" 경로로 등록
app.include_router(chatbot.router, prefix="/api/v1/chatbot")

if __name__ == "__main__":
    uvicorn.run("app.main:app", host=Config.HOST, port=Config.PORT, reload=True)
