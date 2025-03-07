# React 19의 새로운 커스텀 훅

## 소개

React 19에서는 개발자 경험을 향상시키고 더 효율적인 코드 작성을 위한 다양한 새로운 훅들이 도입되었습니다.

## 기본 훅

### **useFormStatus**

폼의 제출 상태를 추적하는 데 사용되는 훅입니다.

```jsx
import { useFormStatus } from 'react';

function SubmitButton() {
  const { pending, data, method, action } = useFormStatus();
  
  return (
    <button disabled={pending} type="submit">
      {pending ? '제출 중...' : '제출하기'}
    </button>
  );
}
```

### **useFormState**

폼 제출 후 상태를 관리하는 데 사용됩니다.

```jsx
import { useFormState } from 'react';

function MyForm() {
  const [state, formAction] = useFormState(submitAction, initialState);
  
  return (
    <form action={formAction}>
      {state.error && <p>{state.error}</p>}
      <input name="name" />
      <button type="submit">제출</button>
    </form>
  );
}
```

### **useOptimistic**

낙관적 UI 업데이트를 구현하는 데 사용됩니다.

```jsx
import { useOptimistic } from 'react';

function MessageThread({ messages }) {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [...state, newMessage]
  );
  
  async function handleSendMessage(formData) {
    const message = formData.get('message');
    
    // 낙관적 업데이트 추가
    addOptimisticMessage({
      id: 'optimistic',
      text: message,
      sending: true
    });
    
    // 실제 API 호출
    await sendMessage(message);
  }
  
  return (
    <div>
      {optimisticMessages.map(message => (
        <div key={message.id} className={message.sending ? 'sending' : ''}>
          {message.text}
        </div>
      ))}
      <form action={handleSendMessage}>
        <input name="message" />
        <button type="submit">전송</button>
      </form>
    </div>
  );
}
```

### **useActionState**

폼 액션의 상태를 관리하는 데 사용됩니다.

```jsx
import { useActionState } from 'react';

function CommentForm() {
  const [state, action] = useActionState(async (prevState, formData) => {
    try {
      await submitComment(formData);
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, { success: false, error: null });
  
  return (
    <form action={action}>
      {state.error && <p className="error">{state.error}</p>}
      {state.success && <p className="success">댓글이 등록되었습니다!</p>}
      <textarea name="comment" />
      <button type="submit">댓글 작성</button>
    </form>
  );
}
```

### **useMemoCache**

메모이제이션 성능을 향상시키는 데 사용됩니다.

```jsx
import { useMemoCache } from 'react';

function ExpensiveComponent({ data }) {
  const cache = useMemoCache();
  
  // 캐시에서 결과 가져오기 또는 계산하기
  const result = cache(0, () => expensiveCalculation(data), [data]);
  
  return <div>{result}</div>;
}
useEvent
이벤트 핸들러의 안정된 참조를 생성하는 데 사용됩니다.
jsxCopyimport { useEvent } from 'react';

function SearchComponent({ query, onSearch }) {
  const handleSearch = useEvent((term) => {
    console.log(`검색어: ${term}`);
    onSearch(term);
  });
  
  return (
    <input 
      type="text" 
      value={query} 
      onChange={(e) => handleSearch(e.target.value)} 
    />
  );
}
```

## 데이터 패칭 훅

### **use**

Promise 또는 Context 값을 소비하는 데 사용됩니다.

```jsx
import { use } from 'react';

function UserProfile({ userPromise }) {
  // userPromise가 해결될 때까지 Suspense가 활성화됨
  const user = use(userPromise);
  
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

### **useDeferredValue**

React 18에서 소개된 이 훅은 React 19에서 성능이 향상되었습니다.

```jsx
import { useDeferredValue } from 'react';

function SearchResults({ query }) {
  // 타이핑 중에는 이전 결과를 표시하고, 타이핑이 멈추면 새 결과를 표시
  const deferredQuery = useDeferredValue(query);
  
  return <ResultsList query={deferredQuery} />;
}
```

## 상태 관리 훅

### **useReducerState**

복잡한 상태 로직을 관리하는 향상된 훅입니다.

```jsx
import { useReducerState } from 'react';

function TodoApp() {
  const [state, actions] = useReducerState({
    todos: [],
    filter: 'all'
  }, {
    addTodo: (state, text) => ({
      ...state,
      todos: [...state.todos, { id: Date.now(), text, completed: false }]
    }),
    toggleTodo: (state, id) => ({
      ...state,
      todos: state.todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    }),
    setFilter: (state, filter) => ({ ...state, filter })
  });
  
  const filteredTodos = /* 필터링 로직 */;
  
  return (
    <div>
      <input 
        type="text" 
        onKeyDown={e => {
          if (e.key === 'Enter') {
            actions.addTodo(e.target.value);
            e.target.value = '';
          }
        }} 
      />
      <div>
        {filteredTodos.map(todo => (
          <div 
            key={todo.id}
            onClick={() => actions.toggleTodo(todo.id)}
            style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
          >
            {todo.text}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### **useEffectEvent**

이펙트 내에서 최신 값을 참조하는 데 사용됩니다.

```jsx
import { useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId, userId }) {
  const onConnected = useEffectEvent(() => {
    console.log(`${userId}가 방 ${roomId}에 연결됨`);
  });
  
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.on('connected', () => {
      onConnected(); // 항상 최신 userId를 참조함
    });
    
    return () => connection.disconnect();
  }, [roomId]); // userId는 의존성 배열에 포함되지 않음
  
  return <div>채팅방 {roomId}</div>;
}
```

## 성능 최적화 훅

### **useTransition**

긴 작업 중에도 UI 응답성을 유지하는 데 사용됩니다. React 19에서 성능이 향상되었습니다.

```jsx
import { useTransition } from 'react';

function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();
  
  function handleChange(e) {
    const value = e.target.value;
    setQuery(value);
    
    startTransition(async () => {
      const data = await fetchSearchResults(value);
      setResults(data);
    });
  }
  
  return (
    <div>
      <input type="text" value={query} onChange={handleChange} />
      {isPending ? <div>검색 중...</div> : <ResultsList results={results} />}
    </div>
  );
}
```

## 결론
React 19의 새로운 훅들은 폼 처리, 낙관적 UI 업데이트, 성능 최적화 등 다양한 영역에서 개발자 경험을 크게 향상시켰습니다.