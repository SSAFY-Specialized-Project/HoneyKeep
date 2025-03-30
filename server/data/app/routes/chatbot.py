from fastapi import APIRouter, HTTPException
from app.models.chatbot_request import ChatbotRequest, ChatbotResponse
from app.services.rag import ask_question
import traceback

router = APIRouter()

@router.post("/ask", response_model=str)
async def ask(request: ChatbotRequest):
    try:
        answer, retrieved_docs, chat_history = ask_question(request.question, request.conversation_id)
        # return ChatbotResponse(answer=answer, retrieved_docs=retrieved_docs, chat_history=chat_history)
        return answer
    
    except Exception as e:
        # 전체 스택 트레이스를 문자열로 생성합니다.
        error_details = traceback.format_exc()
        print(error_details)
        raise HTTPException(status_code=500, detail=error_details)
    