import { initializeApp } from "firebase/app";
import { getMessaging, getToken, MessagePayload, onMessage } from "firebase/messaging";

// Firebase 설정 타입 정의
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

// 환경 변수로부터 Firebase 설정 로드
const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// 서비스 워커 등록 및 FCM 토큰 얻기 함수
export const requestFCMToken = async (): Promise<string> => {
  try {
    if (!('serviceWorker' in navigator)) {
      throw new Error('서비스 워커를 지원하지 않는 브라우저입니다.');
    }
    
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    console.log('서비스 워커 등록 완료');
    
    const currentToken = await getToken(messaging, { 
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY as string,
      serviceWorkerRegistration: registration 
    });
    
    if (!currentToken) {
      throw new Error('FCM 토큰을 가져올 수 없습니다.');
    }
    
    return currentToken;
  } catch (err) {
    console.error('FCM 설정 오류:', err);
    throw err;
  }
};

export type MessageHandler = (payload: MessagePayload) => void;

export const onForegroundMessage = (callback: MessageHandler): (()=>void) => {
  return onMessage(messaging, callback);
}

export { messaging };