// index.ts

/**
 * ArrayBuffer를 Base64 문자열로 변환하는 함수
 * @param buffer 변환할 ArrayBuffer
 * @returns Base64로 인코딩된 문자열
 */
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

/**
 * Base64 문자열을 ArrayBuffer로 변환하는 함수
 * @param base64 변환할 Base64 문자열
 * @returns 디코딩된 ArrayBuffer
 */
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

// 다른 유틸리티 함수들도 여기에 추가 가능