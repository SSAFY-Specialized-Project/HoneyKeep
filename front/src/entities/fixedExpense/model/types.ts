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
    startDate: string;
    payDay: number;
    transactionCount: number;
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
    transactionCount: number;
    memo?: string;
}