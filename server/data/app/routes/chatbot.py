from fastapi import APIRouter, HTTPException, Depends, Response
from fastapi.responses import StreamingResponse, JSONResponse
from app.models.chatbot_request import ChatbotRequest
from app.services.rag import stream_ask_question
from app.auth import get_user_id
from app.services.history import get_chat_history_data

from datetime import datetime
import traceback

router = APIRouter()

@router.post("/query")
async def ask_stream(request: ChatbotRequest, user_id: str = Depends(get_user_id)):
    try:
        generator = stream_ask_question(request.query, user_id)
        # media_type을 "text/event-stream"으로 설정하여 SSE 응답 전송
        return StreamingResponse(generator, media_type="text/event-stream")
    
    except Exception:
        error_details = traceback.format_exc()
        print(error_details)
        raise HTTPException(status_code=500, detail=error_details)


@router.get("/history")
async def history(user_id: str = Depends(get_user_id)):
    try:
        data = get_chat_history_data(f"message_store:chat_history:{user_id}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    if not data:
        response_payload = {
            "status": 204,
            "message": "저장된 대화가 없습니다",
            "data": None,
            "timestamp": datetime.now().isoformat() + "Z"
        }
        return JSONResponse(status_code=200, content=response_payload)
    
    # 데이터가 있으면 200 응답
    response_payload = {
        "status": 200,
        "message": "Success",
        "data": data[::-1],
        "timestamp": datetime.now().isoformat() + "Z"
    }

    return JSONResponse(status_code=200, content=response_payload)
