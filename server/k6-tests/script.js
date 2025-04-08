// script.js
import http from 'k6/http';
import { check, sleep } from 'k6';

// Prometheus Remote Write 엔드포인트 (docker-compose.monitoring.yml의 서비스 이름 사용)
const prometheusEndpoint = 'http://prometheus:9090/api/v1/write';

export const options = {
  ext: {
    loadimpact: {
      prometheus: {
        // Prometheus 서비스 이름과 포트를 사용하여 엔드포인트 설정
        endpoint: prometheusEndpoint,
        // 네임스페이스나 이름은 필요에 따라 설정 가능
        // namespace: "k6",
        // name: "myapp_metrics",
      }
    }
  },
  // 테스트 시나리오 설정
  vus: 1,            // 5명의 가상 사용자
  duration: '1m',    // 1분 동안 테스트 실행
  thresholds: {      // 성능 목표 설정 (옵션)
    http_req_duration: ['p(95)<500'], // 95% 요청의 응답 시간이 500ms 미만이어야 함
    http_req_failed: ['rate<0.01'],   // 실패율이 1% 미만이어야 함
  },
};

export default function () {
  const params = {
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc0NDA4NTk4NiwiZXhwIjoyNzQ0MDg1OTg1fQ.u8Kckcv-T4ihPayCTNf9igPvYRj2nckPxFreVwuiqwk', // 
    },
  };
  const res = http.get('http://backend-test:8080/api/v1/sample', params);

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  if (res.status !== 200) {
    console.log(`Request failed with status: ${res.status}`);
  }

  sleep(0.5);
}