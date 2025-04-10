import getChatHistoryAPI from '@/entities/chat/api/getChatHistoryAPI';
import { ChatItemType } from '@/entities/chat/model/types';
import { useHeaderStore } from '@/shared/store';
import { Icon, ImageContainer } from '@/shared/ui';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';

const Chatbot = () => {
  const { setTitle } = useHeaderStore();

  const [messages, setMessages] = useState<ChatItemType[]>([
    { type: 'BOT', text: '안녕하세요!', link: null },
  ]);
  const [isConnected, setConnected] = useState<boolean>(false);
  const [isResponding, setResponding] = useState<boolean>(false);
  const [text, setText] = useState<string>('');
  const abortControllerRef = useRef<AbortController | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  // 현재 스트리밍 중인 봇 메시지의 인덱스를 저장하기 위한 참조
  const currentBotMessageIndexRef = useRef<number>(-1);

  const classification_mapping = {
    1: '/pocket/create',
    2: '/pocket/list',
    3: '/pocket/list',
    4: '/pocket/calendar',
    5: '/fixedExpense/list',
    6: '/fixedExpense/create',
    7: null,
  };

  const scrollToBottom = () => {
    if (!messageEndRef.current) return;
    messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const closeConnection = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setConnected(false);
    setResponding(false);
  };

  useEffect(() => {
    setTitle('챗봇 상담');

    return () => {
      closeConnection();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const { data: chatData } = useQuery({
    queryFn: getChatHistoryAPI,
    queryKey: ['chat-history'],
    staleTime: 60 * 1000 * 20,
  });

  useEffect(() => {
    if (chatData && Array.isArray(chatData.data) && messages.length === 1 && messages[0].text === '안녕하세요!') {
      console.log('Loading chat history...');
      const chatHistory = chatData.data.map((item) => ({
        type: (item.senderId === 'USER' ? 'USER' : 'BOT') as ChatItemType['type'],
        text: item.content,
        link: null
      }));
      setMessages((prev) => [...prev, ...chatHistory]);
    } else if (chatData && !Array.isArray(chatData.data)) {
      console.warn("Chat history data received, but 'data' field is not an array:", chatData);
    }
  }, [chatData, messages]);

  const sendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isConnected) return;

    if (!text.trim() || isResponding) return;

    const userMessage: ChatItemType = { type: 'USER', text: text.trim(), link: null };
    setMessages((prev) => [...prev, userMessage]);

    const botResponse: ChatItemType = { type: 'BOT', text: '', link: null };
    setMessages((prev) => {
      // 새 봇 메시지의 인덱스 저장
      currentBotMessageIndexRef.current = prev.length;
      return [...prev, botResponse];
    });

    setText('');
    setResponding(true);

    // 새 AbortController 생성
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const addTokenWithDelay = (token: string) => {
      return new Promise<void>((resolve) => {
        // 현재 메시지 업데이트
        setMessages((prev) => {
          const newMessages = [...prev];
          if (currentBotMessageIndexRef.current < newMessages.length) {
            const currentText = newMessages[currentBotMessageIndexRef.current].text;
            newMessages[currentBotMessageIndexRef.current] = {
              ...newMessages[currentBotMessageIndexRef.current],
              text: currentText + token,
            };
          }
          return newMessages;
        });

        // 작은 지연 후 다음 토큰 처리 (타이핑 효과를 위해)
        // 토큰이 '.' 같은 구두점이거나 빈 문자열이면 지연 없이 처리
        const delay = token.trim() === '' || ['.', ',', '!', '?', ' '].includes(token) ? 0 : 100;
        setTimeout(resolve, delay);
      });
    };

    try {
      // POST 요청을 보내고 SSE 스트림 설정
      const response = await fetch(`https://j12a405.p.ssafy.io/api/v2/chatbot/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          query: userMessage.text,
          // 필요한 다른 파라미터를 여기에 추가
        }),
        signal,
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is null');
      }

      const decoder = new TextDecoder();
      let accumulatedData = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // 디코딩 및 누적
        const chunk = decoder.decode(value, { stream: true });
        accumulatedData += chunk;

        // SSE 형식 처리: 각 이벤트는 "data: " 로 시작하고 "\n\n"으로 끝남
        const eventSeparator = accumulatedData.split('\n\n');
        const incompleteEvent = eventSeparator.pop() || ''; // 마지막 항목은 불완전할 수 있음
        accumulatedData = incompleteEvent;

        for (const eventText of eventSeparator) {
          if (eventText.trim() === '') continue;

          // "data: " 프리픽스 제거
          const jsonData = eventText.replace(/^data: /, '').trim();

          try {
            const data = JSON.parse(jsonData);

            if (data.type === 'final_answer_token') {
              // 각 토큰을 순차적으로 표시 (타이핑 효과)
              await addTokenWithDelay(data.token);
            } else if (data.type === 'classification') {
              const linkType: 1 | 2 | 3 | 4 | 5 | 6 | 7 = data.classification;
              const link = classification_mapping[linkType];
              // 분류 정보 처리 (필요한 경우)
              console.log('Classification received:', data.classification);
              // 응답 완료 처리
              setResponding(false);

              setMessages((prev) => {
                const newMessages = [...prev];
                if (currentBotMessageIndexRef.current < newMessages.length) {
                  newMessages[currentBotMessageIndexRef.current] = {
                    ...newMessages[currentBotMessageIndexRef.current],
                    link: link, // 링크 속성 업데이트
                  };
                }
                return newMessages;
              });
            }
          } catch (e) {
            console.error('Failed to parse SSE data:', e);
          }
        }
      }
    } catch (err) {
      // err가 Error 인스턴스인지 확인 후 name 속성 접근
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Error fetching chat response:', err);
        setMessages((prev) => {
          const newMessages = [...prev];
          if (currentBotMessageIndexRef.current < newMessages.length) {
            newMessages[currentBotMessageIndexRef.current] = {
              ...newMessages[currentBotMessageIndexRef.current],
              text: '죄송합니다. 응답을 가져오는 중 오류가 발생했습니다.',
            };
          }
          return newMessages;
        });
      } else if (!(err instanceof Error)) {
        // Error 인스턴스가 아닌 다른 예외 처리 (선택 사항)
        console.error('An unexpected error occurred:', err);
      }
    } finally {
      setResponding(false);
      abortControllerRef.current = null;
    }
  };

  const handleMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.currentTarget.value);
  };

  return (
    <div className="flex h-full w-full flex-col px-5 py-5">
      <ul className="flex w-full flex-grow flex-col gap-4 overflow-y-auto">
        {messages.map((message, index) => (
          <li
            key={index}
            className={`flex gap-4 ${message.type === 'USER' ? 'justify-end' : 'justify-start items-start'}`}
          >
            {message.type == 'BOT' ? (
              <ImageContainer imgSrc={'/image/ChatBot.png'} size="small" />
            ) : null}
            <div className="flex flex-col items-start max-w-[75%] gap-2">
              <div
                className={`rounded-lg p-3 ${message.type === 'USER' ? 'bg-blue-100' : 'bg-gray-100'}`}
              >
                {message.type === 'BOT' ? (
                  <div
                    className="markdown-content"
                    dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(message.text) }}
                  />
                ) : (
                  <div>{message.text}</div>
                )}
              </div>
              {message.link != null && (
                <Link 
                  to={message.link} 
                  className="inline-flex items-center px-3 py-1.5 bg-brand-primary-100 text-brand-primary-700 text-md font-medium rounded-md hover:bg-brand-primary-200 transition-colors"
                >
                  해당 기능으로 이동하기
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              )}
            </div>
          </li>
        ))}
        <div ref={messageEndRef} />
      </ul>
      <form
        onSubmit={sendChatMessage}
        className="relative mt-auto w-full rounded-xl bg-gray-100 px-5 py-2.5"
      >
        <label htmlFor="chatbot"></label>
        <input
          type="text"
          name="chatbot"
          id="chatbot"
          placeholder="무엇이 궁금하신가요?"
          value={text}
          onChange={handleMessage}
          disabled={isResponding}
          className="w-full bg-transparent pr-10 outline-none"
        />
        <button
          type="submit"
          className="absolute top-1/2 right-5 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition-all duration-200 ease-in-out transform hover:scale-110 cursor-pointer"
          disabled={isResponding || !text.trim()}
        >
          {/* Icon 색상이 기본적으로 회색 계열이라고 가정 */}
          <Icon id="send-plane" size="small" />
        </button>
      </form>
    </div>
  );
};
// 간단한 마크다운 변환 함수
const convertMarkdownToHtml = (markdown: string) => {
  if (!markdown) return '';

  // 헤딩 변환 (### 제목 -> <h3>제목</h3>)
  let html = markdown.replace(/### (.*?)$/gm, '<h3>$1</h3>');
  html = html.replace(/## (.*?)$/gm, '<h2>$1</h2>');
  html = html.replace(/# (.*?)$/gm, '<h1>$1</h1>');

  // 볼드 텍스트 변환 (**텍스트** -> <strong>텍스트</strong>)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // 이탤릭 텍스트 변환 (*텍스트* -> <em>텍스트</em>)
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // 목록 변환 (- 항목 -> <li>항목</li>)
  html = html.replace(/^\- (.*?)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*?<\/li>\n)+/g, '<ul></ul>');

  // 코드 블록 변환
  html = html.replace(/```([^`]*?)```/gs, '<pre><code>$1</code></pre>');

  // 인라인 코드 변환
  html = html.replace(/`([^`]*?)`/g, '<code>$1</code>');

  // 단락 변환 (빈 줄로 구분된 텍스트 -> <p>텍스트</p>)
  html = html.replace(/^\s*(\S[\s\S]*?)(?=\n\s*\n|\n*$)/gm, '<p>$1</p>');

  return html;
};

export default Chatbot;
