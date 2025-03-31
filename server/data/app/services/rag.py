import json
from langchain.chat_models import ChatOpenAI
from langchain.chains import ConversationalRetrievalChain
from langchain.prompts import PromptTemplate
from langchain.memory import ConversationBufferMemory
from langchain.memory.chat_message_histories import RedisChatMessageHistory
from langchain_core.messages.utils import messages_from_dict

from app.services.document_loader import create_vector_store
from app.config import Config


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

        print(new_items)
        print(type(new_items))

        return messages_from_dict(new_items)
    

# 벡터스토어 및 리트리버 생성
vector_store = create_vector_store()
retriever = vector_store.as_retriever()

# 프롬프트 템플릿 정의
# 질문 독립화 프롬프트: 대화 내역과 후속 질문을 독립 질문으로 재구성
CONDENSE_QUESTION_PROMPT = PromptTemplate.from_template(
    "다음 대화 내역과 후속 질문을 독립적인 질문으로 재구성해줘.\n\n"
    "대화 내역:\n{chat_history}\n"
    "후속 질문: {question}\n"
    "독립적인 질문:"
)

# --- LLM 초기화 ---
llm = ChatOpenAI(
    temperature=0,
    openai_api_key=Config.OPENAI_API_KEY,
    model_name="gpt-4o"
)


def get_memory(conversation_id: int) -> ConversationBufferMemory:
    """
    주어진 conversation_id에 대해 Redis에 저장된 대화 히스토리를 불러와
    ConversationBufferMemory 객체로 반환
    """
    # RedisChatMessageHistory는 conversation_id를 key로 사용하여 히스토리를 저장
    
    # Redis URL 형식: "redis://<host>:<port>/<db>"
    redis_url = f"redis://:{Config.REDIS_PASSWORD}@{Config.REDIS_HOST}:{Config.REDIS_PORT}/{Config.REDIS_DB}"

    history = ReadOnlyRedisChatMessageHistory(session_id=f"chat_history:{conversation_id}", url=redis_url)
    memory = ConversationBufferMemory(chat_memory=history, memory_key="chat_history", return_messages=True)
    return memory


def get_conversation_chain(memory: ConversationBufferMemory) -> ConversationalRetrievalChain:
    """
    주어진 메모리를 사용하여 대화형 retrieval 체인을 생성
    """
    conversation_chain = ConversationalRetrievalChain.from_llm(
        llm,
        retriever=retriever,
        memory=memory,
        condense_question_prompt=CONDENSE_QUESTION_PROMPT,
        chain_type="stuff"  # retrieved 문서들을 단순히 연결해 LLM에 전달
    )

    return conversation_chain


def ask_question(query: str, conversation_id: int):
    """
    conversation_id에 해당하는 대화 메모리를 Redis에서 불러오고,
    retrieval 체인을 통해 질문에 대한 답변을 생성
    반환값: (답변, retrieval된 문서 목록, 대화 내역 메시지 리스트)
    """
    memory = get_memory(conversation_id)
    conversation_chain = get_conversation_chain(memory)
    
    result = conversation_chain({"question": query, "chat_history": memory.chat_memory.messages})
    
    # chat_history는 Redis에 저장된 메시지들의 리스트 (각 메시지 객체의 .content 속성을 사용)
    chat_history_text = [msg.content for msg in memory.chat_memory.messages]
    
    # retrieved_docs가 존재한다면 문서의 page_content를 추출
    retrieved_docs = []
    if "source_documents" in result:
        for doc in result["source_documents"]:
            retrieved_docs.append(doc.page_content)
    
    return result["answer"], retrieved_docs, chat_history_text
