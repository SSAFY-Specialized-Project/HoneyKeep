// generateCertification.ts
import {arrayBufferToBase64} from './index';
import {ResponseDTO} from "@/shared/model/types.ts";

// 전역적인 메모리 내 개인키 참조 (직접 접근 불가능, 사용만 가능)
let currentPrivateKey: CryptoKey | null = null;

/**
 * 공개키/개인키 쌍을 생성하고 공개키만 서버로 전송하기 위한 함수
 */
export async function generateKeyPair(): Promise<{
    publicKeyBase64: string;
}> {
    try {
        // RSA 알고리즘으로 2048비트 키 쌍 생성 (서명과 암호화에 모두 사용)
        const keyPair = await window.crypto.subtle.generateKey(
            {
                name: "RSA-PSS", // 서명에 적합한 알고리즘
                modulusLength: 2048,
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
                hash: "SHA-256",
            },
            false, // 키를 내보낼 수 없게 설정
            ["sign", "verify"] // 서명 및 검증 용도
        );

        // 메모리에 개인키 참조 저장 (키 자체가 아니라 참조만 저장)
        currentPrivateKey = keyPair.privateKey;

        // 공개키를 내보내기 (서버로 전송할 형태)
        const publicKeyExported = await window.crypto.subtle.exportKey(
            "spki", // SubjectPublicKeyInfo 형식
            keyPair.publicKey
        );

        // ArrayBuffer를 Base64로 변환
        const publicKeyBase64 = arrayBufferToBase64(publicKeyExported);

        // 키 객체를 IndexedDB에 저장
        await storeKeyInIndexedDB(keyPair.privateKey, "sign");

        return {
            publicKeyBase64
        };
    } catch (err) {
        console.error("키 생성 오류:", err);
        throw err;
    }
}

/**
 * CryptoKey 객체를 IndexedDB에 저장하는 함수
 */
async function storeKeyInIndexedDB(privateKey: CryptoKey, keyUsage: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("SecureKeyDB", 1);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains("keys")) {
                db.createObjectStore("keys", {keyPath: "id"});
            }
        };

        request.onerror = (event) => {
            reject(`IndexedDB 오류: ${(event.target as IDBOpenDBRequest).error}`);
        };

        request.onsuccess = (event) => {
            try {
                const db = (event.target as IDBOpenDBRequest).result;
                const transaction = db.transaction(["keys"], "readwrite");
                const store = transaction.objectStore("keys");

                const keyData = {
                    id: `userPrivateKey_${keyUsage}`,
                    key: privateKey,
                    usage: keyUsage,
                    timestamp: new Date().toISOString()
                };

                const putRequest = store.put(keyData);

                putRequest.onsuccess = () => {
                    resolve();
                };

                putRequest.onerror = (event) => {
                    reject(`키 저장 오류: ${(event.target as IDBRequest).error}`);
                };

                transaction.oncomplete = () => {
                    db.close();
                };
            } catch (error) {
                reject(`트랜잭션 오류: ${error}`);
            }
        };
    });
}

/**
 * IndexedDB에서 개인키를 가져오는 함수
 */
export async function loadPrivateKey(keyUsage: string = "sign"): Promise<boolean> {
    return new Promise((resolve) => {
        const request = indexedDB.open("SecureKeyDB", 1);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains("keys")) {
                db.createObjectStore("keys", {keyPath: "id"});
            }
        };

        request.onerror = () => {
            resolve(false); // DB 열기 실패
        };

        request.onsuccess = (event) => {
            try {
                const db = (event.target as IDBOpenDBRequest).result;

                if (!db.objectStoreNames.contains("keys")) {
                    resolve(false);
                    return;
                }

                const transaction = db.transaction(["keys"], "readonly");
                const store = transaction.objectStore("keys");
                const getRequest = store.get(`userPrivateKey_${keyUsage}`);

                getRequest.onsuccess = () => {
                    if (getRequest.result) {
                        currentPrivateKey = getRequest.result.key;
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                };

                getRequest.onerror = () => {
                    resolve(false);
                };

                transaction.oncomplete = () => {
                    db.close();
                };
            } catch (error) {
                console.error("개인키 로드 오류:", error);
                resolve(false);
            }
        };
    });
}

/**
 * 데이터에 디지털 서명하는 함수
 * @param data 서명할 데이터 (문자열)
 * @returns 서명된 데이터의 Base64 문자열
 */
export async function signData(data: string): Promise<string> {
    if (!currentPrivateKey) {
        // 키가 메모리에 없으면 IndexedDB에서 로드 시도
        const loaded = await loadPrivateKey("sign");
        if (!loaded) {
            throw new Error("서명용 개인키를 찾을 수 없습니다. 새 키를 생성해주세요.");
        }
    }

    try {
        // 문자열을 바이트 배열로 변환
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);

        // 개인키로 서명
        const signature = await window.crypto.subtle.sign(
            {
                name: "RSA-PSS",
                saltLength: 32,
                hash: {name: "SHA-256"},
            },
            currentPrivateKey!,
            dataBuffer
        );

        // 서명을 Base64로 변환하여 반환
        return arrayBufferToBase64(signature);
    } catch (error) {
        console.error("서명 오류:", error);
        throw error;
    }
}

/**
 * TODO: input/output 타입 정하기!
 * 결제/이체 요청 데이터에 서명하는 함수
 * @param requestData 결제/이체 요청 데이터 객체
 * @returns 원본 데이터와 서명을 포함한 객체
 */
export async function signPaymentRequest(requestData: any): Promise<{ data: any; signature: string }> {
    // 데이터를 정렬된 문자열로 변환하여 일관된 서명 보장
    const dataString = JSON.stringify(requestData, Object.keys(requestData).sort());

    // 데이터에 서명
    const signature = await signData(dataString);

    return {
        data: requestData,
        signature
    };
}

/**
 * TODO: input/output 타입 정하기!
 * 결제/이체 요청 보내는 함수
 */
export async function sendPaymentRequest(paymentData: any): Promise<ResponseDTO<any>> {
    try {
        // 결제 데이터에 서명
        const signedData = await signPaymentRequest(paymentData);

        // 서명된 데이터와 함께 서버에 요청
        const response = await fetch('/api/v1/payment/request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signedData)
        });

        if (!response.ok) {
            throw new Error('결제 요청 실패');
        }

        return await response.json();
    } catch (error) {
        console.error('결제 요청 오류:', error);
        throw error;
    }
}

/**
 * 저장된 개인키가 있는지 확인하는 함수
 */
export async function hasStoredPrivateKey(keyUsage: string = "sign"): Promise<boolean> {
    if (currentPrivateKey) {
        return true;
    }

    return await loadPrivateKey(keyUsage);
}

/**
 * 개인키 삭제 함수
 */
export async function clearPrivateKey(keyUsage?: string): Promise<void> {
    // 메모리에서 개인키 참조 제거
    currentPrivateKey = null;

    // IndexedDB에서 키 삭제
    return new Promise((resolve) => {
        const request = indexedDB.open("SecureKeyDB", 1);

        request.onerror = () => {
            resolve(); // 실패해도 일단 진행
        };

        request.onsuccess = (event) => {
            try {
                const db = (event.target as IDBOpenDBRequest).result;

                if (!db.objectStoreNames.contains("keys")) {
                    resolve();
                    return;
                }

                const transaction = db.transaction(["keys"], "readwrite");
                const store = transaction.objectStore("keys");

                if (keyUsage) {
                    // 특정 용도의 키만 삭제
                    store.delete(`userPrivateKey_${keyUsage}`);
                } else {
                    // 모든 키 삭제를 위해 키 조회
                    const getAllRequest = store.getAll();
                    getAllRequest.onsuccess = () => {
                        const keys = getAllRequest.result;
                        keys.forEach(key => {
                            store.delete(key.id);
                        });
                    };
                }

                transaction.oncomplete = () => {
                    db.close();
                    resolve();
                };
            } catch (error) {
                console.error("키 삭제 오류:", error);
                resolve();
            }
        };
    });
}