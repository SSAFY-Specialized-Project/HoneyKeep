# 25/03/06

## requests 모듈(HTTP 라이브러리)

### 소개

`requests` 라이브러리는 쉽게 HTTP 요청을 보낼 수 있게 해주는 파이썬 라이브러리
requests 라이브러리는 웹 서버나 API에 요청을 보내거나, 웹 페이지의 HTML 코드나 웹사이트의 내용을 가져오는 데 활용

### 주요 함수

| 함수                | 설명                      |
| ------------------- | ------------------------- |
| `requests.get()`    | 주소로 GET 요청을 보냄    |
| `requests.post()`   | 주소로 POST 요청을 보냄   |
| `requests.put()`    | 주소로 PUT 요청을 보냄    |
| `requests.delete()` | 주소로 DELETE 요청을 보냄 |

### 구현 예시

아래 코드는 `requests` 라이브러리를 import 하고, 명시한 주소로 GET 요청을 보내 상태 코드와 페이지 내용을 확인한 예시

```python
import requests

url = "https://www.google.com"

response = requests.get(url)

print("상태 코드:", response.status_code)

print("페이지 내용:", response.text)
```

### 실행 결과

```
상태 코드: 200
페이지 내용: <!doctype html>...</html>
```

## 기술 활용

- 외부 API와의 통신
- 웹 데이터 수집(웹 스크래핑)
- RESTful API 요청 처리
- 웹 서비스 상태 모니터링
