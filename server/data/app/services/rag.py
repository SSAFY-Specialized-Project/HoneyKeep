from langchain.chat_models import ChatOpenAI
from langchain.chains import ConversationalRetrievalChain, LLMChain
from langchain.memory import ConversationBufferMemory

from app.services.memory import ReadOnlyRedisChatMessageHistory
from app.services.prompts import *
from app.services.document_loader import create_vector_store
from app.config import Config
    

# 벡터스토어 및 리트리버 생성
vector_store = create_vector_store()
retriever = vector_store.as_retriever()

# --- LLM 초기화 ---
llm = ChatOpenAI(
    temperature=Config.TEMPERATURE,
    openai_api_key=Config.OPENAI_API_KEY,
    model_name=Config.MODEL_NAME
)

# 분류 체인 생성 (LLMChain 사용)
classification_chain = LLMChain(llm=llm, prompt=CLASSIFICATION_PROMPT)

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
    
    generated_answer = result["answer"]
    
    # retrieved_docs가 존재한다면 문서의 page_content를 추출
    retrieved_docs = []
    if "source_documents" in result:
        for doc in result["source_documents"]:
            retrieved_docs.append(doc.page_content)
    
    # 추가 분류 체인 실행: 생성된 답변을 10개의 기능 중 어느 것에 해당하는지 분류
    classification_result = classification_chain.run(
        answer=generated_answer,
        retrieved_docs=retrieved_docs[0] if retrieved_docs else "참조할 문서가 없습니다."
    )
    
    return generated_answer, classification_result
