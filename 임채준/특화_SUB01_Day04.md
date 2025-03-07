# 25/03/07

## BeautifulSoup(HTML/XML 파서 라이브러리)

### 소개

`BeautifulSoup`은 HTML과 XML 문서들을 파싱하는 데 사용되는 파이썬 라이브러리
HTML과 XML 파일들의 데이터를 추출하거나, 구조를 분석하고 수정하는 데 사용 특정 태그나 클래스, 아이디를 가진 요소를 찾아내는 기능 제공

### 주요 함수

| 함수          | 설명                                                              |
| ------------- | ----------------------------------------------------------------- |
| `.prettify()` | HTML을 파악하기 쉽게 구조를 변경하여 반환                         |
| `.find_all()` | 태그의 이름, 속성, 혹은 속성값으로 그에 해당하는 모든 태그를 반환 |
| `.select()`   | CSS를 이용하여 해당하는 모든 태그를 반환                          |

### 구현 예시

BeautifulSoup 라이브러리를 import 하고 BeautifulSoup 라이브러리로 HTML의 내용을 분석하여 h1 태그 안의 string을 반환

```python
from bs4 import BeautifulSoup

html_code = "<html><body><h1>안녕하세요!</h1></body></html>"

soup = BeautifulSoup(html_code, 'html.parser')

print("h1 태그의 텍스트:", soup.h1.string)
```

### 실행 결과

```
h1 태그의 텍스트: 안녕하세요!
```

### 기술 활용

- 웹 크롤링 및 스크래핑을 통한 데이터 수집
- HTML 문서 파싱 및 특정 정보 추출
- 웹 페이지 구조 분석
- XML 데이터 처리
