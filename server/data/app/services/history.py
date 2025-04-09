from app.config import Config
from redis import Redis
import json


def get_chat_history_data(conversation_id: str) -> list:
    """
    Redis에 저장된 대화 내역을 가져와 원하는 포맷의 메시지 리스트로 반환합니다.
    데이터가 없으면 빈 리스트([])를 반환합니다.
    """
    try:
        redis_client = Redis(
            host=Config.REDIS_HOST,
            port=Config.REDIS_PORT,
            db=Config.REDIS_DB,
            password=Config.REDIS_PASSWORD,
            decode_responses=True  # bytes 대신 문자열 반환
        )

    except Exception as e:
        raise Exception(f"Redis 연결 실패: {e}")

    # 키가 없으면 빈 리스트 반환
    if not redis_client.exists(conversation_id):
        return []
    
    try:
        items = redis_client.lrange(conversation_id, 0, -1)
    except Exception as e:
        raise Exception(f"Redis에서 대화 내역 불러오기 실패: {e}")

    messages = []
    for item in items:
        try:
            data = json.loads(item)
            messages.append(data)
        except Exception:
            # JSON 디코딩 실패한 항목은 건너뜁니다.
            continue

    # 각 메시지의 type에 따라 senderId를 매핑하여 변환
    transformed_messages = []
    for msg in messages:
        msg_type = msg.get("type", "")
        if msg_type == "human":
            sender_id = "USER"
        elif msg_type == "ai":
            sender_id = "BOT"
        else:
            sender_id = "UNKNOWN"
        content = msg.get("data", {}).get("content", "")
        transformed_messages.append({
            "senderId": sender_id,
            "content": content
        })
    
    return transformed_messages
