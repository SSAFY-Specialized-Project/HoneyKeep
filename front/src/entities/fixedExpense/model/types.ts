export interface FixedExpenseResponse {
    id: number;
    account: {
        bankName: string;
        accountName: string;
        accountNumber: string;
    };
    name: string;
    money: {
        amount: number;
    };
    startDate: string; // LocalDate는 JSON으로 'YYYY-MM-DD' 형식으로 변환됨
    payDay: number;
    memo: string;
}

export interface DetectedFixedExpenseResponse {
    id: number;
    account: {
        bankName: string;
        accountName: string;
        accountNumber: string;
    };
    name: string;
    averageAmount: string;
    averageDay: number;
    transactionCount: number;
}

export interface FixedExpenseRequest {
    accountNumber: string;
    name: string;
    money: {
        amount: number;
    };
    startDate: string; // ISO 형식의 날짜 문자열 (YYYY-MM-DD)
    payDay: number;
    memo?: string;
}