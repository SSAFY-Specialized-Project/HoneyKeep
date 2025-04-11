import requests

def test_chatbot():
    # FastAPI 서버가 실행 중인 주소와 포트를 지정합니다.
    url = "http://127.0.0.1:8081/chatbot/ask"
    
    # 테스트를 위한 요청 페이로드 구성: 질문과 고유 conversation_id
    payload = {
        "question": "다음달 식비 30만원 빼놓으려고 하는데 어떻게 해야돼?",
        "conversation_id": 1
    }
    
    # POST 요청 전송
    response = requests.post(url, json=payload)
    
    if response.status_code == 200:
        data = response.text
        # print(data.get("answer"))
        print(data)
        print()
    else:
        print("요청 실패", response.status_code, response.text)

if __name__ == "__main__":
    test_chatbot()