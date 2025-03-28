from langchain.chat_models import ChatOpenAI
from langchain.chains import ConversationalRetrievalChain
from langchain.prompts import PromptTemplate
from langchain.memory import ConversationBufferMemory
from langchain.memory.chat_message_histories import RedisChatMessageHistory
from redis import Redis

from app.services.document_loader import create_vector_store
from app.config import Config


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


def get_memory(conversation_id: str) -> ConversationBufferMemory:
    """
    주어진 conversation_id에 대해 Redis에 저장된 대화 히스토리를 불러와
    ConversationBufferMemory 객체로 반환
    """
    # RedisChatMessageHistory는 conversation_id를 key로 사용하여 히스토리를 저장
    
    # Redis URL 형식: "redis://<host>:<port>/<db>"
    redis_url = f"redis://:{Config.REDIS_PASSWORD}@{Config.REDIS_HOST}:{Config.REDIS_PORT}/{Config.REDIS_DB}"

    history = RedisChatMessageHistory(session_id=f"chat_history:{conversation_id}", url=redis_url)
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


def ask_question(query: str, conversation_id: str):
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
    
    # retrieved_docs가 존재한다면 문서의 page_content를 추출합니다.
    retrieved_docs = []
    if "source_documents" in result:
        for doc in result["source_documents"]:
            retrieved_docs.append(doc.page_content)
    
    return result["answer"], retrieved_docs, chat_history_text
