from pydantic import BaseModel, Field
from typing import List, Optional

# Spring에서 넘어온 query와 대화 ID
class ChatbotRequest(BaseModel):
    query: str
    conversation_id: int = Field(..., alias="conversationId")


class ChatbotResponse(BaseModel):
    answer: str
    classification_result: int=Field(..., alias="classificationResult")
