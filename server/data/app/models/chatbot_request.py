from pydantic import BaseModel
from typing import List, Optional

# Spring에서 넘어온 query와 대화 ID
class ChatbotRequest(BaseModel):
    question: str
    conversation_id: str


class ChatbotResponse(BaseModel):
    answer: str
    retrieved_docs: List[str] = []
    chat_history: Optional[List[str]] = None
