// generate-sw.js
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // .env 파일 로드

// 템플릿 파일 읽기
const templatePath = path.resolve(__dirname, 'firebase-messaging-sw-template.js');
const template = fs.readFileSync(templatePath, 'utf-8');

// 환경 변수로 템플릿 채우기
let swContent = template;
swContent = swContent.replace('__FIREBASE_API_KEY__', import.meta.env.VITE_FIREBASE_API_KEY || '');
swContent = swContent.replace(
  '__FIREBASE_AUTH_DOMAIN__',
  import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
);
swContent = swContent.replace(
  '__FIREBASE_PROJECT_ID__',
  import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
);
swContent = swContent.replace(
  '__FIREBASE_STORAGE_BUCKET__',
  import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
);
swContent = swContent.replace(
  '__FIREBASE_MESSAGING_SENDER_ID__',
  import.meta.env.VITE_FIREBASE_SENDER_ID || '',
);
swContent = swContent.replace('__FIREBASE_APP_ID__', import.meta.env.VITE_FIREBASE_APP_ID || '');

// public 폴더 확인 및 생성
const publicDir = path.resolve(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 서비스 워커 파일 생성
const swPath = path.resolve(publicDir, 'firebase-messaging-sw.js');
fs.writeFileSync(swPath, swContent);

console.log('Firebase 서비스 워커가 생성되었습니다:', swPath);
