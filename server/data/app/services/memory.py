import json
from langchain.memory.chat_message_histories import RedisChatMessageHistory
from langchain_core.messages.utils import messages_from_dict

class ReadOnlyRedisChatMessageHistory(RedisChatMessageHistory):
    def add_message(self, message) -> None:
        # 저장하지 않음으로써, 대화 내역 갱신(쓰기)을 무력화
        pass

    def clear(self) -> None:
        # 지우기 작업도 필요없다면 아무 동작도 하지 않음
        pass

    @property
    def messages(self):
        # Redis에서 리스트 형식으로 저장된 메시지들을 읽음
        items = self.redis_client.lrange(self.key, 0, -1)
        new_items = []
        for item in items:
            # Redis에서 반환되는 item이 bytes인 경우, 문자열로 디코딩
            if isinstance(item, bytes):
                item = item.decode("utf-8")
            try:
                # 첫 번째 디코딩 시도
                loaded = json.loads(item)
                # 만약 결과가 여전히 문자열이면, 다시 json.loads 시도
                if isinstance(loaded, str):
                    loaded = json.loads(loaded)
                new_items.append(loaded)
            except Exception as e:
                new_items.append(item)

        return messages_from_dict(new_items)
    