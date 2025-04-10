from langchain.chat_models import ChatOpenAI
from langchain.chains import ConversationalRetrievalChain, LLMChain
from langchain.memory import ConversationBufferMemory
from langchain.chains.question_answering import load_qa_chain

from app.services.memory import ChatMessageHistory
from app.services.prompts import *
from app.services.document_loader import create_vector_store
from app.config import Config
from app.services.callback import SSECallbackHandler
import asyncio
import json


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

    history = ChatMessageHistory(session_id=f"chat_history:{conversation_id}", url=redis_url)
    memory = ConversationBufferMemory(chat_memory=history, memory_key="chat_history", return_messages=True)
    return memory


def get_conversation_chain(memory: ConversationBufferMemory, streaming_handler=None) -> ConversationalRetrievalChain:
    if streaming_handler:
        # Condense 단계용: 스트리밍 없이 생성
        non_streaming_llm = ChatOpenAI(
            temperature=Config.TEMPERATURE,
            openai_api_key=Config.OPENAI_API_KEY,
            model_name=Config.MODEL_NAME,
            streaming=False  # 스트리밍 비활성화
        )
        # 최종 답변 단계용: 스트리밍 활성화
        streaming_llm = ChatOpenAI(
            temperature=Config.TEMPERATURE,
            openai_api_key=Config.OPENAI_API_KEY,
            model_name=Config.MODEL_NAME,
            streaming=True,
            callbacks=[streaming_handler]
        )
        
        # 먼저 condense 단계는 non_streaming_llm으로 처리 (qa_prompt 파라미터 제거)
        conversation_chain = ConversationalRetrievalChain.from_llm(
            non_streaming_llm,
            retriever=retriever,
            memory=memory,
            condense_question_prompt=CONDENSE_QUESTION_PROMPT,
            chain_type="stuff"
        )
        
        # 최종 답변을 위한 QA 체인 생성
        qa_chain = load_qa_chain(streaming_llm, chain_type="stuff", prompt=QA_PROMPT)
        
        # 기존 combine_docs_chain을 새로운 체인으로 교체
        conversation_chain.combine_docs_chain = qa_chain
        
        return conversation_chain
    else:
        # 스트리밍 핸들러가 없는 경우
        standard_llm = ChatOpenAI(
            temperature=Config.TEMPERATURE,
            openai_api_key=Config.OPENAI_API_KEY,
            model_name=Config.MODEL_NAME,
        )
        
        conversation_chain = ConversationalRetrievalChain.from_llm(
            standard_llm,
            retriever=retriever,
            memory=memory,
            condense_question_prompt=CONDENSE_QUESTION_PROMPT,
            chain_type="stuff"
        )
        
        # 최종 답변을 위한 QA 체인 생성
        qa_chain = load_qa_chain(standard_llm, chain_type="stuff", prompt=QA_PROMPT)
        
        # 기존 combine_docs_chain을 새로운 체인으로 교체
        conversation_chain.combine_docs_chain = qa_chain
        
        return conversation_chain


async def stream_ask_question(query: str, conversation_id: int):
    # 토큰을 받을 큐와 핸들러 생성
    queue = asyncio.Queue()
    streaming_handler = SSECallbackHandler(queue)

    # 대화 메모리와 체인 생성 (두 단계에 대해 스트리밍 콜백 적용)
    memory = get_memory(conversation_id)
    conversation_chain = get_conversation_chain(memory, streaming_handler)

    # 체인 비동기 호출 (acall 사용)
    result_future = asyncio.create_task(
        conversation_chain.acall({"question": query, "chat_history": memory.chat_memory.messages})
    )

    # 큐에서 발생하는 메시지를 실시간으로 읽어 SSE 이벤트로 전송
    while True:
        msg = await queue.get()
        if msg is None:
            break
        if msg["type"] == "token":
            # 즉시 SSE 이벤트로 전달
            yield f"data: {json.dumps({'token': msg['token'], 'type': 'final_answer_token'}, ensure_ascii=False)}\n\n"

    # 체인 실행 완료 대기
    result = await result_future
    generated_answer = result.get("answer", "")
    print("[Aggregator] Final generated answer from chain:", generated_answer)

    # 분류 결과 처리 및 SSE 전송 (필요한 경우)
    retrieved_docs = []
    if "source_documents" in result:
        for doc in result["source_documents"]:
            retrieved_docs.append(doc.page_content)

    classification_result = classification_chain.run(
        answer=generated_answer,
        retrieved_docs=retrieved_docs[0] if retrieved_docs else "참조할 문서가 없습니다."
    )

    print("[Aggregator] Classification result:", classification_result)
    yield f"data: {json.dumps({'classification': classification_result, 'type': 'classification'}, ensure_ascii=False)}\n\n"
