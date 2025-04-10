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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      setTitle('');
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
    if (
      chatData &&
      Array.isArray(chatData.data) &&
      messages.length === 1 &&
      messages[0].text === '안녕하세요!'
    ) {
      console.log('Loading chat history...');
      const chatHistory = chatData.data.map((item) => ({
        type: (item.senderId === 'USER' ? 'USER' : 'BOT') as ChatItemType['type'],
        text: item.content,
        link: null,
      }));
      setMessages((prev) => [...prev, ...chatHistory]);
    } else if (chatData && !Array.isArray(chatData.data)) {
      console.warn("Chat history data received, but 'data' field is not an array:", chatData);
    }
  }, [chatData, messages]);

  // sendChatMessage 함수 부분을 수정했습니다
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

    // 현재 응답 텍스트를 추적하기 위한 로컬 변수
    let currentResponseText = '';

    const addTokenWithDelay = (token: string) => {
      return new Promise<void>((resolve) => {
        // 로컬 변수에 토큰 추가
        currentResponseText += token;

        // 함수형 업데이트로 최신 상태 보장
        setMessages((prev) => {
          const newMessages = [...prev];
          if (currentBotMessageIndexRef.current < newMessages.length) {
            newMessages[currentBotMessageIndexRef.current] = {
              ...newMessages[currentBotMessageIndexRef.current],
              text: currentResponseText, // 로컬 변수 사용
            };
          }
          return newMessages;
        });

        // 작은 지연 후 다음 토큰 처리 (타이핑 효과를 위해)
        // 토큰이 '.' 같은 구두점이거나 빈 문자열이면 지연 없이 처리
        const delay = token.trim() === '' || ['.', ',', '!', '?', ' '].includes(token) ? 0 : 30;
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

      // 토큰을 일괄 처리하기 위한 버퍼
      let tokenBuffer = '';
      let lastUpdateTime = Date.now();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          // 마지막 남은 토큰 버퍼를 처리
          if (tokenBuffer) {
            await addTokenWithDelay(tokenBuffer);
          }
          break;
        }

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
              // 토큰 버퍼에 추가
              tokenBuffer += data.token;

              // 일정 시간이 지났거나 버퍼가 특정 크기에 도달하면 업데이트
              const currentTime = Date.now();
              if (currentTime - lastUpdateTime > 30 || tokenBuffer.length >= 10) {
                await addTokenWithDelay(tokenBuffer);
                tokenBuffer = '';
                lastUpdateTime = currentTime;
              }
            } else if (data.type === 'classification') {
              // 남은 토큰 버퍼 처리
              if (tokenBuffer) {
                await addTokenWithDelay(tokenBuffer);
                tokenBuffer = '';
              }

              const linkType: 1 | 2 | 3 | 4 | 5 | 6 | 7 = data.classification;
              const link = classification_mapping[linkType];
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
        console.error('An unexpected error occurred:', err);
      }
    } finally {
      setResponding(false);
      abortControllerRef.current = null;
    }
  };

  const handleMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.currentTarget.value);

    // Textarea 높이 자동 조절
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // 높이를 초기화해야 scrollHeight가 정확히 계산됨
      textareaRef.current.style.height = `${e.currentTarget.scrollHeight}px`; // scrollHeight만큼 높이 설정
    }
  };

  return (
    <div className="flex h-full w-full flex-col px-5 py-5">
      <ul className="flex w-full flex-grow flex-col gap-4 overflow-y-auto">
        {messages.map((message, index) => (
          <li
            key={index}
            className={`flex gap-4 ${message.type === 'USER' ? 'justify-end' : 'items-start justify-start'}`}
          >
            {message.type == 'BOT' ? (
              <ImageContainer imgSrc={'/image/ChatBot.png'} size="small" />
            ) : null}
            <div className="flex max-w-[75%] flex-col items-start gap-2">
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
                  className="bg-brand-primary-100 text-brand-primary-700 text-md hover:bg-brand-primary-200 inline-flex items-center rounded-md px-3 py-1.5 font-medium transition-colors"
                >
                  해당 기능으로 이동하기
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-1 h-4.5 w-4.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
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
        className="relative mt-auto flex w-full items-center rounded-xl bg-gray-100 px-5 py-2"
      >
        <label htmlFor="chatbot"></label>
        <textarea
          ref={textareaRef}
          rows={1}
          name="chatbot"
          id="chatbot"
          placeholder="무엇이 궁금하신가요?"
          value={text}
          onChange={handleMessage}
          disabled={isResponding}
          className="flex-grow resize-none overflow-hidden bg-transparent pr-10 outline-none"
          style={{ maxHeight: '120px' }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendChatMessage(e);
            }
          }}
        />
        <button
          type="submit"
          className="absolute top-1/2 right-5 -translate-y-1/2 transform cursor-pointer rounded-full p-1 transition-all duration-200 ease-in-out hover:scale-110 hover:bg-gray-200"
          disabled={isResponding || !text.trim()}
        >
          <Icon id="send-plane" size="small" />
        </button>
      </form>
    </div>
  );
};

// 개선된 마크다운 변환 함수
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

  // 목록 변환 개선 - 먼저 각 목록 항목을 <li> 태그로 변환
  html = html.replace(/^\- (.*?)$/gm, '<li>$1</li>');

  // 연속된 <li> 태그들을 찾아서 <ul> 태그로 감싸기
  // 기존 코드는 <li> 태그들을 제거하고 빈 <ul></ul>로 대체했음
  let inList = false;
  const lines = html.split('\n');
  html = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('<li>')) {
      // 목록이 시작되는 경우
      if (!inList) {
        html += '<ul>\n';
        inList = true;
      }
      html += line + '\n';
    } else {
      // 목록이 아닌 경우
      if (inList) {
        html += '</ul>\n';
        inList = false;
      }
      html += line + '\n';
    }
  }

  // 목록이 끝나지 않았을 경우 닫기
  if (inList) {
    html += '</ul>\n';
  }

  // 코드 블록 변환
  html = html.replace(/```([^`]*?)```/gs, '<pre><code>$1</code></pre>');

  // 인라인 코드 변환
  html = html.replace(/`([^`]*?)`/g, '<code>$1</code>');

  // 단락 변환 - 이미 변환된 HTML 태그는 건너뛰도록 개선
  // <h1>, <h2>, <h3>, <ul>, <pre> 등의 태그가 없는 텍스트 블록만 <p> 태그로 변환
  const htmlTagRegex = /<\/?[a-z][^>]*>/i;
  const paragraphs = html.split(/\n\s*\n/);
  html = '';

  for (const paragraph of paragraphs) {
    if (paragraph.trim() === '') continue;

    // 이미 HTML 태그가 있는지 확인
    if (!htmlTagRegex.test(paragraph)) {
      html += `<p>${paragraph.trim()}</p>\n\n`;
    } else {
      html += paragraph + '\n\n';
    }
  }

  return html;
};

export default Chatbot;
