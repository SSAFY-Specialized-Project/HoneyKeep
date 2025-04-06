const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
};

// Firebase 앱 호환성 라이브러리와 메시징 라이브러리 가져오기
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Firebase 초기화
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// 백그라운드 메시지 처리 리스너
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] 백그라운드 메시지 수신:', payload);

  // 알림 데이터 추출
  const notificationTitle = payload.notification.title || '알림';
  const notificationOptions = {
    body: payload.notification.body || '',
    icon: payload.notification.icon || '/firebase-logo.png',
    badge: payload.notification.badge,
    image: payload.notification.image,
    tag: payload.notification.tag,
    data: payload.data,
  };

  // 알림 표시
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// 알림 클릭 이벤트 처리
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] 알림 클릭');
  event.notification.close();

  // 클릭 시 이동할 URL (payload.data.url이 있으면 사용, 없으면 기본 URL 사용)
  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true,
      })
      .then((clientList) => {
        // 이미 열린 창이 있는지 확인
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // 열린 창이 없으면 새 창 열기
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      }),
  );
});

// 푸시 이벤트 리스너 (개발자 도구의 Push 버튼용)
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push 이벤트 발생:', event);

  let message = 'Push 메시지가 도착했습니다';
  try {
    if (event.data) {
      message = event.data.text();
    }
  } catch (e) {
    console.error('Push 메시지 파싱 오류:', e);
  }

  event.waitUntil(
    self.registration.showNotification('Push 알림', {
      body: message,
      icon: '/pwa-192x192.png',
    }),
  );
});

// 서비스 워커 설치 이벤트
self.addEventListener('install', (event) => {
  console.log('[firebase-messaging-sw.js] 서비스 워커 설치 중...');
  self.skipWaiting();
});

// 서비스 워커 활성화 이벤트
self.addEventListener('activate', (event) => {
  console.log('[firebase-messaging-sw.js] 서비스 워커 활성화됨');
});
