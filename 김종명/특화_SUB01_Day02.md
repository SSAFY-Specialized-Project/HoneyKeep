# React Router 주요 기능
## 기본 라우팅 기능

- `선언적 라우팅`: JSX를 사용한 직관적인 라우트 정의
- `중첩 라우팅`: 라우트 내에 하위 라우트 구성 가능
- `동적 라우트 매칭`: URL 파라미터를 통한 동적 페이지 렌더링

## 핵심 컴포넌트

- `<BrowserRouter>`: HTML5 History API 기반 라우팅
- `<Routes>`: 여러 `<Route>` 컴포넌트를 그룹화
- `<Route>`: 특정 URL에 컴포넌트 매핑
- `<Link>`: 페이지 새로고침 없이 내비게이션 처리
- `<NavLink>`: 액티브 상태 스타일링 기능이 추가된 링크

## 훅(Hooks)

- `useParams()`: URL 파라미터 접근
- `useNavigate()`: 프로그래밍 방식으로 페이지 이동
- `useLocation()`: 현재 URL 정보 접근
- `useSearchParams()`: 쿼리 파라미터 관리
- `useMatch()`: 특정 경로 매칭 여부 확인

## 고급 기능

- **레이지 로딩**: React.lazy()와 결합한 코드 스플리팅
- **보호된 라우트**: 인증 상태에 따른 접근 제어
- **데이터 로딩**: 페이지 전환 전 데이터 프리페칭
- **메모리 라우터**: 테스트 환경용 비브라우저 라우팅
- **해시 라우터**: 정적 호스팅 환경용 라우팅

### 라우트 구성 예시

```jsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="products" element={<Products />}>
        <Route index element={<ProductList />} />
        <Route path=":id" element={<ProductDetail />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
</BrowserRouter>
```

## 데이터 라우터

- **loader**: 컴포넌트 렌더링 전 데이터 로딩
- **action**: 폼 제출 같은 변이 처리
- **useLoaderData()**: 로더에서 반환된 데이터 접근
- **useActionData()**: 액션에서 반환된 데이터 접근
- **useFetcher()**: 페이지 전환 없는 데이터 조작