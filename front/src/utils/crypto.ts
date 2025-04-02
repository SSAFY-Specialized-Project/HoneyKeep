import {signData} from "@/entities/certification/lib/generateCeritication.ts";

/**
 * API 요청에 사용할 서명 헤더를 생성하는 함수
 * @param method HTTP 메서드
 * @param url 요청 URL
 * @param body 요청 본문 (선택)
 * @returns 서명 헤더 객체
 */
export async function createSignatureHeader(method: string, url: string, body?: any): Promise<{ 'X-Signature': string, 'X-Timestamp': string }> {
    const timestamp = Date.now().toString();

    // 개행문자를 명시적으로 처리하고 디버깅 출력 추가
    const lineBreak = "\n"; // 명시적으로 \n 사용
    const sign = `${method}${lineBreak}${url}${lineBreak}${timestamp}${lineBreak}${body ? JSON.stringify(body) : ''}`;

    const signature = await signData(sign);
    return {
        'X-Signature': signature,
        'X-Timestamp': timestamp
    };
}