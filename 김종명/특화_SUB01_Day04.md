# React 19에서 SSR 구현 방법

## 개요
React 19에서 서버 사이드 렌더링(SSR)은 이전 버전보다 더 효율적으로 개선되었습니다.

### 기본 설정

#### 필요한 패키지 설치

```Bash
bashCopynpm install react@19 react-dom@19
# 또는
yarn add react@19 react-dom@19
```

### 서버 측 렌더링 기본 구조

```Jsx
// server.js
import { renderToPipeableStream } from 'react-dom/server';
import { App } from './App';

function handleRequest(req, res) {
  const { pipe } = renderToPipeableStream(<App />, {
    bootstrapScripts: ['/client.js'],
    onShellReady() {
      res.setHeader('Content-Type', 'text/html');
      pipe(res);
    }
  });
}
```

### React 19의 새로운 SSR 기능

#### 1. 스트리밍 SSR

React 19에서는 스트리밍 렌더링이 생겼습니다.

```Jsx
import { renderToPipeableStream } from 'react-dom/server';

const { pipe, abort } = renderToPipeableStream(
  <App />,
  {
    bootstrapScripts: ['/client.js'],
    onShellReady() {
      // 우선 HTML의 셸(Shell)을 전송
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      pipe(res);
    },
    onAllReady() {
      // 모든 데이터가 준비된 경우 (선택 사항)
      console.log('모든 데이터 스트리밍 완료');
    },
    onError(error) {
      console.error(error);
      res.statusCode = 500;
      res.end('서버 오류가 발생했습니다');
    }
  }
);
```
#### 2. Suspense와 함께 SSR 사용

React 19에서는 Suspense를 SSR에 더 잘 활용할 수 있습니다:

```Jsx
// App.jsx
import { Suspense } from 'react';
import { DataComponent } from './DataComponent';

export function App() {
  return (
    <html>
      <head>
        <title>React 19 SSR 예제</title>
      </head>
      <body>
        <div id="root">
          <h1>React 19 SSR</h1>
          <Suspense fallback={<div>데이터 로딩 중...</div>}>
            <DataComponent />
          </Suspense>
        </div>
      </body>
    </html>
  );
}
```

#### 3. 서버 컴포넌트와 통합

React 19에서는 서버 컴포넌트와 SSR의 통합이 강화되었습니다:

```jsx
// server-component.jsx
'use server';

export async function ServerComponent() {
  const data = await fetchData();
  return <div>{data.map(item => <p key={item.id}>{item.text}</p>)}</div>;
}

// client.jsx
import { Suspense } from 'react';
import { ServerComponent } from './server-component';

function ClientWrapper() {
  return (
    <Suspense fallback={<div>서버 컴포넌트 로딩 중...</div>}>
      <ServerComponent />
    </Suspense>
  );
}
```

#### 클라이언트 측 하이드레이션

```jsx
// client.js
import { hydrateRoot } from 'react-dom/client';
import { App } from './App';

hydrateRoot(document, <App />);
동시성 모드(Concurrent Mode)와 SSR
React 19에서는 동시성 모드가 기본 활성화되어 SSR과 함께 작동합니다:
jsxCopy// 서버에서 스트리밍 + 클라이언트에서 선택적 하이드레이션
import { renderToPipeableStream } from 'react-dom/server';

renderToPipeableStream(<App />, {
  bootstrapScripts: ['/client.js'],
  onShellReady() {
    res.setHeader('Content-Type', 'text/html');
    pipe(res);
  }
});
```

```jsx
// 클라이언트 측
import { hydrateRoot } from 'react-dom/client';
hydrateRoot(document, <App />);
성능 최적화
1. 선택적 하이드레이션(Selective Hydration)
jsxCopyimport { Suspense } from 'react';

function App() {
  return (
    <div>
      <Suspense fallback={<header>헤더 로딩 중...</header>}>
        <Header />
      </Suspense>
      
      <Suspense fallback={<main>콘텐츠 로딩 중...</main>}>
        <MainContent />
      </Suspense>
      
      <Suspense fallback={<footer>푸터 로딩 중...</footer>}>
        <Footer />
      </Suspense>
    </div>
  );
}
```

### 결론
React 19의 SSR은 스트리밍, Suspense, 서버 컴포넌트 등의 새로운 기능으로 더욱 강력해졌습니다. 이러한 기능들을 잘 활용하면 더 빠르고 효율적인 웹 애플리케이션을 구축할 수 있습니다.