# 1. 로컬 실행

## 1.1 도커 데스크탑 설치
[Docker Desktop](https://docs.docker.com/desktop/setup/install/windows-install/)

## 1.2 백엔드 컨테이너 실행
S12P21A405 를 컨텍스트로 프로젝트를 연다.

다음 환경변수 파일을 /server 에 생성한다.
```
# BACKEND
SPRING_PROFILES_ACTIVE=dev

POSTGRES_USER=ssafy
POSTGRES_PASSWORD=ssafy
POSTGRES_DB=honeykeep

SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/honeykeep
SPRING_DATASOURCE_USERNAME=ssafy
SPRING_DATASOURCE_PASSWORD=ssafy

MONGO_INITDB_ROOT_USERNAME=ssafy
MONGO_INITDB_ROOT_PASSWORD=ssafy
SPRING_DATA_MONGODB_URI=mongodb://ssafy:ssafy@mongodb:27017/honeykeep?authSource=admin

REDIS_PASSWORD=ssafy
REDIS_HOST=redis
REDIS_PORT=6379

JWT_SECRET=p8Kdr5LzqEYvXm7F2gTbHnJc9RxUaWs3iN6jZoG4VfDuQtA1CkMeBhyIwP0SO
JWT_EXPIRE_SEC=999999999
JWT_REFRESH_EXPIRE_SEC=1209600

AWS_ACCESS_KEY=AKIASU566OWLRMZMBCFP
AWS_SECRET_KEY=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
AWS_S3_BUCKET=honeykeep

DATA_URL=http://127.0.0.1:8081

SECRET_KEY=K43K534K5K43K5L4

SSAFY_FINANCIAL_NETWORK_API_KEY=e26901e8543e4d219c7a952aaee3dd9f

SPRING_MAIL_USERNAME=bsh793262@gmail.com
SPRING_MAIL_PASSWORD=ognj bnmg dlxc onfw

LOG_PATH=C:/honeykeep/logs

APP_COOKIE_DOMAIN=localhost

CERT_CA_KEYSTORE_PATH=classpath:certs/ca-keystore.p12
CERT_CA_KEYSTORE_PASSWORD=hoonbae
CERT_CA_KEY_ALIAS=honeykeep-ca

OPENAI_API_KEY=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

REDIS_DB=0

DATA_HOST="127.0.0.1"

DOCUMENT_PATH="./document/documents.txt"

WEBAUTHN_RP_ID=localhost
WEBAUTHN_RP_NAME=honeykeep
WEBAUTHN_RP_ORIGIN=http://localhost:5173
```

터미널 오픈 후 다음을 순서대로 실행
```
cd S12P21A405/server
docker-compose up -d --build
```

## 1.3 프론트엔드 실행

다음 환경변수 파일을 /front 에 생성한다.
```
# FRONTEND

VITE_BASE_URL=http://localhost:8080/api/v1

VITE_FIREBASE_API_KEY="AIzaSyApidiogiMTIOM0Vu-UTr55f9UOwBO4BBo"
VITE_FIREBASE_AUTH_DOMAIN="honeykeep-55e4b.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="honeykeep-55e4b"
VITE_FIREBASE_STORAGE_BUCKET="honeykeep-55e4b.firebasestorage.app"
VITE_FIREBASE_SENDER_ID="682734431277"
VITE_FIREBASE_APP_ID="1:682734431277:web:b5644103dfc56d0afedca4"
```

터미널 오픈 후 다음을 순서대로 실행
```
cd S12P21A405/front
npm install
npm run dev
```

localhost:5173 으로 접속

<br/><br/>


# 2. 배포

서버 접속
```
ssh -i /경로/프라이빗키.pem ubuntu@ip-172-26-13-42
```

# 2.1 젠킨스 설정 및 컨테이너 실행

다음을 실행해 젠킨스 컨테이너를 실행한다.

```
docker run --name jenkins-server -d -p 9090:8080 -p 50000:50000 --network my-network -v jenkins_home:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock -u jenkins --group-add 999 -e JENKINS_OPTS=--prefix=/jenkins jenkins/jenkins:lts
```

젠킨스 컨테이너 실행 후 젠킨스 웹 페이지에 접속한다.

`https://{호스트}/jenkins/`

젠킨스 글로벌 환경변수로 다음을 설정한다.

```
SPRING_PROFILES_ACTIVE=prod

#PostgreSQL
POSTGRES_USER=ssafy
POSTGRES_PASSWORD=ssafy
POSTGRES_DB=honeykeep

SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/honeykeep
SPRING_DATASOURCE_USERNAME=ssafy
SPRING_DATASOURCE_PASSWORD=ssafy

#MongoDB
MONGO_INITDB_ROOT_USERNAME=ssafy
MONGO_INITDB_ROOT_PASSWORD=ssafy
SPRING_DATA_MONGODB_URI=mongodb://ssafy:ssafy@mongodb:27017/honeykeep?authSource=admin

#Redis
REDIS_PASSWORD=ssafy
REDIS_HOST=redis
REDIS_PORT=6379

# JWT
JWT_SECRET=p8Kdr5LzqEYvXm7F2gTbHnJc9RxUaWs3iN6jZoG4VfDuQtA1CkMeBhyIwP0SO
JWT_EXPIRE_SEC=7200
JWT_REFRESH_EXPIRE_SEC=1209600

# AWS
AWS_ACCESS_KEY=AKIASU566OWLRMZMBCFP
AWS_SECRET_KEY=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
AWS_S3_BUCKET=honeykeep

SECRET_KEY=K43K534K5K43K5L4

SSAFY_FINANCIAL_NETWORK_API_KEY=e26901e8543e4d219c7a952aaee3dd9f

SPRING_MAIL_USERNAME=bsh793262@gmail.com
SPRING_MAIL_PASSWORD=ognj bnmg dlxc onfw

LOG_PATH=C:/honeykeep/logs
```

# 2.2 nginx 설정 및 컨테이너 실행

/home/ubuntu/nginx/conf.d 에 다음 파일을 생성한다.

```
# HTTP 요청을 HTTPS로 리다이렉트 (ssl.conf)
server {
    client_max_body_size 50M;
    listen 80;
    server_name j12a405.p.ssafy.io;
    return 301 https://$host$request_uri;
}

# HTTPS 요청 처리 및 리버스 프록시 설정 (ssl.conf)
server {
    listen 443 ssl;
    server_name j12a405.p.ssafy.io;

    ssl_certificate /etc/letsencrypt/live/j12a405.p.ssafy.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/j12a405.p.ssafy.io/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    client_max_body_size 50M;
    
    
    #프론트엔드 React 앱 reverse proxy
    location / {
        proxy_pass http://my-frontend:3000/;  # 프론트 컨테이너가 my-network에 my-frontend 이름으로 있음
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port 443;

        # Caching 방지 (SPA 새로고침 오류 방지용)
        add_header Cache-Control no-cache;

        # WebSocket 지원 (필요할 경우)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }



    #백엔드 SpringBoot reverse proxy
    location /api/v1/ {
        proxy_pass http://springboot-backend:8080/api/v1/;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port 443;


        # WebSocket 지원 (필요할 경우)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }


    location /api/v2/ {
        proxy_pass http://ai-server:8081/api/v2/;
        proxy_http_version 1.1;

        # 원본 요청 정보 전달
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header X-Forwarded-Host  $host;
        proxy_set_header X-Forwarded-Port  443;
        proxy_set_header Origin            $http_origin;

        # WebSocket 지원
        proxy_set_header Upgrade           $http_upgrade;
        proxy_set_header Connection        "upgrade";
    }



    location /jenkins/ {
        proxy_pass http://jenkins-server:8080/jenkins/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
	proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port 443;

	proxy_redirect ~^http://jenkins-server:8080/jenkins/(.*) https://j12a405.p.ssafy.io/jenkins/$1;
    
	# WebSocket 지원 추가 (Jenkins Blue Ocean 사용 시 필수)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
    }
}

```

nginx 컨테이너를 실행한다.

```
docker run --name nginx-server -d -p 80:80 -p 443:443 --network my-network -v /home/ubuntu/nginx/conf.d:/etc/nginx/conf.d -v /etc/letsencrypt:/etc/letsencrypt -v /home/ubuntu/nginx/logs:/home/ubuntu/nginx/logs -e TZ=Asia/Seoul nginx:latest
```

<br/><br/>

# 2.3 프론트엔드 파이프라인

젠킨스에 프론트엔드 파이프라인을 추가한다.

```jenkinsfile
pipeline {
  agent any

  environment {
    IMAGE_NAME = 'my-frontend'           // Docker 이미지 이름
    CONTAINER_NAME = 'my-frontend'       // 컨테이너 이름
    PORT = '3000'                        // 외부 접근 포트
    DOCKER_NETWORK = 'my-network'        // 설정한 Docker 네트워크 이름
    VITE_BASE_URL = 'https://j12a405.p.ssafy.io/api/v1'
    VITE_FIREBASE_API_KEY='AIzaSyApidiogiMTIOM0Vu-UTr55f9UOwBO4BBo'
    VITE_FIREBASE_AUTH_DOMAIN='honeykeep-55e4b.firebaseapp.com'
    VITE_FIREBASE_PROJECT_ID='honeykeep-55e4b'
    VITE_FIREBASE_STORAGE_BUCKET='honeykeep-55e4b.firebasestorage.app'
    VITE_FIREBASE_SENDER_ID='682734431277'
    VITE_FIREBASE_APP_ID='1:682734431277:web:b5644103dfc56d0afedca4'
  }

  stages {
    stage('Print Environment') { // 환경변수 출력 (디버깅 용)
            steps {
                sh 'printenv'
            }
        }
    stage('GitLab Project Download') {
      steps {
        echo " Git 저장소에서 소스 코드 가져오는 중..."
            deleteDir()
            git url: 'https://lab.ssafy.com/s12-fintech-finance-sub1/S12P21A405.git',
            branch: 'FE/develop',
            credentialsId: '68834565-333f-4e5c-8ad1-4e784214b0ea'
      }
    }

    stage('Build Docker Image') {
      steps {
        echo "🔧 Docker 이미지 빌드 중..."
        //sh "docker build -t $IMAGE_NAME ./front" // Dockerfile이 front 폴더에 있음
        sh """
        docker build \\
          --build-arg VITE_BASE_URL='${VITE_BASE_URL}' \\
          --build-arg VITE_FIREBASE_API_KEY='${VITE_FIREBASE_API_KEY}' \\
          --build-arg VITE_FIREBASE_AUTH_DOMAIN='${VITE_FIREBASE_AUTH_DOMAIN}' \\
          --build-arg VITE_FIREBASE_PROJECT_ID='${VITE_FIREBASE_PROJECT_ID}' \\
          --build-arg VITE_FIREBASE_STORAGE_BUCKET='${VITE_FIREBASE_STORAGE_BUCKET}' \\
          --build-arg VITE_FIREBASE_SENDER_ID='${VITE_FIREBASE_SENDER_ID}' \\
          --build-arg VITE_FIREBASE_APP_ID='${VITE_FIREBASE_APP_ID}' \\
          --build-arg VITE_FIREBASE_MEASUREMENT_ID='${VITE_FIREBASE_MEASUREMENT_ID}' \\
          -t ${IMAGE_NAME} ./front
        """
      }
    }

    stage('Stop & Remove Old Container') {
      steps {
        echo " 기존 컨테이너 제거 중..."
        sh """
          if [ \$(docker ps -q -f name=$CONTAINER_NAME) ]; then
            docker stop $CONTAINER_NAME
            docker rm $CONTAINER_NAME
          fi
        """
      }
    }

    stage('Run New Container') {
      steps {
        echo " 새 컨테이너 실행 중..."
        sh """
          docker run -d \
            --name $CONTAINER_NAME \
            --network $DOCKER_NETWORK \
            -p $PORT:3000 \
            -e TZ=Asia/Seoul \
            -e VITE_BASE_URL=$VITE_BASE_URL \
            -e VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY \
            -e VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN \
            -e VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID \
            -e VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET \
            -e VITE_FIREBASE_SENDER_ID=$VITE_FIREBASE_SENDER_ID \
            -e VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID \
            -e VITE_FIREBASE_MEASUREMENT_ID=$VITE_FIREBASE_MEASUREMENT_ID \
            $IMAGE_NAME
        """
      }
    }
  }

  post {
    success {
      echo "프론트엔드 자동 배포 완료!"
    }
    failure {
      echo "배포 실패! 로그를 확인해주세요."
    }
  }
}

```

<br/><br/>

# 2.4 백엔드 파이프라인

젠킨스에 백엔드 파이프라인을 추가한다.

```jenkinsfile
pipeline {
    agent any
    stages {
        stage('Print Environment') { // 환경변수 출력 (디버깅 용)
            steps {
                sh 'printenv'
            }
        }        
        stage('GitLab Project Download') {
            steps {
                deleteDir()
                git url: 'https://lab.ssafy.com/s12-fintech-finance-sub1/S12P21A405.git',
                branch: 'BE/develop',
                credentialsId: '68834565-333f-4e5c-8ad1-4e784214b0ea'
            }
        }
        stage('Build service'){
            steps {
                dir('server/back') { // S12P21A405/back`에서 실행
                    sh 'chmod +x gradlew && ./gradlew clean build -x test'
                }
            }
        }
        
        stage('Build Verification') { // 빌드 검증
            steps {
                dir('server/back'){
                    sh 'ls build/libs/*.jar' // .jar` 파일이 존재하는지 확인    
                }
                
            }
        }        

        stage('Deploy'){
            steps{
                dir('server'){
                    sh 'docker-compose down --remove-orphans'
                    sh 'docker-compose up -d --build'                    
                }

            }
        }
    }
}
```

<br/><br/>
