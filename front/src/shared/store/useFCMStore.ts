// store/fcmStore.ts
import { create } from 'zustand';
import { requestFCMToken, onForegroundMessage } from '../core/notification/settingFCM';
import { MessagePayload } from 'firebase/messaging';



interface FCMState {
  token: string | null;
  error: Error | null;
  isInitialized: boolean;
  initializeFCM: () => Promise<void>;
}

const useFCMStore = create<FCMState>((set) => ({
  token: null,
  error: null,
  isInitialized: false,
  initializeFCM: async () => {
    console.log("이니셜라이즈 실행");
    // 이미 초기화되었으면 다시 실행하지 않음
    if (useFCMStore.getState().isInitialized) return;
    
    try {
      const fcmToken = await requestFCMToken();
      
      // 포그라운드 메시지 리스너 설정
      onForegroundMessage((payload: MessagePayload) => {
        console.log('알림 수신:', payload);
        
        // 브라우저 알림 표시
        const { notification } = payload;
        console.log(" 알림 도착!");
      });
      
      set({ token: fcmToken, isInitialized: true });
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error('FCM 초기화 실패:', err);
      set({ error, isInitialized: true });
    }
  }
}));

export default useFCMStore;