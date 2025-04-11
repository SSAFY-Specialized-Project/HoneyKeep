import { customFetchAPI } from "@/shared/api";
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

// 알림 권한 요청 함수
export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    if (!('Notification' in window)) {
      console.warn('이 브라우저는 알림을 지원하지 않습니다.');
      return false;
    }

    // 이미 권한이 있는 경우
    if (Notification.permission === 'granted') {
      return true;
    }

    // 이미 권한이 거부된 경우
    if (Notification.permission === 'denied') {
      console.warn('알림 권한이 이전에 거부되었습니다.');
      return false;
    }

    // 권한 요청
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (err) {
    console.error('알림 권한 요청 오류:', err);
    return false;
  }
};

// 서비스 워커 등록 및 FCM 토큰 얻기 함수
export const requestFCMToken = async (): Promise<string | null> => {
  
    if(localStorage.getItem("FCMToken") != null){
      console.log("토큰 이미 있어!");
      return null;
    }

  try {

    // 먼저 알림 권한 요청
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      console.warn('알림 권한이 없어 FCM 토큰을 가져올 수 없습니다.');
      return null;
    }

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
    console.log("토큰 서버에 전송!");
    await sendTokenToServer(currentToken);

    localStorage.setItem("FCMToken", currentToken);
    return currentToken;
  } catch (err) {
    console.error('FCM 설정 오류:', err);
    throw err;
  }
};

const sendTokenToServer = (token:string) => customFetchAPI({url: "/notifications/token", method:"POST", data:{token}});

export type MessageHandler = (payload: MessagePayload) => void;

export const onForegroundMessage = (callback: MessageHandler): (()=>void) => {
  return onMessage(messaging, callback);
}

export { messaging };