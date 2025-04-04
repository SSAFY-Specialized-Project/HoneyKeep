package com.barcode.honeykeep.notification.config;

import com.barcode.honeykeep.common.exception.CustomException;
import com.barcode.honeykeep.notification.exception.NotificationErrorCode;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Configuration;
import javax.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void init() throws IOException{

        InputStream serviceAccountStream = null;

        // 배포 환경에서는 Docker 볼륨 마운트로 인해
        // 환경 변수 GOOGLE_APPLICATION_CREDENTIALS에 컨테이너 내부의 파일 경로가 설정됨.
        String credentialsPath = System.getenv("GOOGLE_APPLICATION_CREDENTIALS");

        //배포 환경일 때
        if(credentialsPath != null && !credentialsPath.isEmpty()){
            serviceAccountStream = new FileInputStream(credentialsPath);
        }
        //로컬 환경일 때
        else {
            serviceAccountStream = getClass().getClassLoader().getResourceAsStream("firebase/honeykeep-55e4b-firebase-adminsdk-fbsvc-fccd58a678.json");
        }

        // 만약 키 파일을 찾지 못했다면 예외를 발생시켜 빠르게 문제를 확인할 수 있도록 함.
        if (serviceAccountStream == null) {
            throw new CustomException(NotificationErrorCode.SERVICE_ACCOUNT_KEY_NOT_FOUND);
        }

        // 키 파일에서 읽어온 자격 증명을 사용하여 Firebase 인증 옵션을 설정함.
        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccountStream))
                .build();


        // FirebaseApp이 이미 초기화되어 있지 않은 경우에만 초기화 수행.
        // FirebaseApp.getApps()는 현재 초기화된 모든 Firebase 애플리케이션 인스턴스를 반환함.
        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseApp.initializeApp(options);
        }
    }
}