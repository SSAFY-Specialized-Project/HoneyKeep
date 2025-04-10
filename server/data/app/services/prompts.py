from langchain.prompts import PromptTemplate

# 프롬프트 템플릿 정의
# 질문 독립화 프롬프트: 대화 내역과 후속 질문을 독립 질문으로 재구성
CONDENSE_QUESTION_PROMPT = PromptTemplate.from_template(
    "다음 대화 내역과 후속 질문을 독립적인 질문으로 재구성해줘.\n"
    "최종 답변은 100자 이내 분량으로 구성해줘.\n\n"
    "대화 내역:\n{chat_history}\n"
    "후속 질문: {question}\n"
    "독립적인 질문:"
)

# 기능 목록
FUNCTIONALITIES = """
1. 포켓 생성
2. 포켓 상세
3. 포켓 목록
4. 캘린더
5. 고정지출 목록
6. 고정지출 생성
7. 해당 사항 없음
"""

# 추가 분류 프롬프트 템플릿
CLASSIFICATION_PROMPT = PromptTemplate.from_template(
    "다음 답변과 참고 문서를 기반으로, 아래의 기능 목록 중 어느 것과 가장 관련 있는지 분류해줘.\n\n"
    "답변:\n{answer}\n\n"
    "참고 문서:\n{retrieved_docs}\n\n"
    "기능 목록:\n" + FUNCTIONALITIES + "\n\n"
    "가장 관련 있는 기능의 번호(int)만 출력해줘. 만약 어느 기능에도 해당하지 않으면 7을 출력해줘."
)
