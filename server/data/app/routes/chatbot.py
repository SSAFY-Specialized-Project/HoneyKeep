from fastapi import APIRouter, HTTPException
from app.models.chatbot_request import ChatbotRequest, ChatbotResponse
from app.services.rag import ask_question
import traceback

router = APIRouter()

@router.post("/ask", response_model=ChatbotResponse)
async def ask(request: ChatbotRequest):
    try:
        answer, classification_result = ask_question(request.query, request.conversation_id)
        return ChatbotResponse(answer=answer, classificationResult=classification_result)
    
    except Exception:
        # 전체 스택 트레이스를 문자열로 생성합니다.
        error_details = traceback.format_exc()
        print(error_details)
        raise HTTPException(status_code=500, detail=error_details)
    