export interface BankAuthForMydataRequest {
    bankCode: string;
    accountNo: string;
}

export interface BankAuthForMydataResponse {
    transactionUniqueNo: string;
    accountNo: string;
}

export interface AccountVerifyForMydataRequest {
    accountNo: string;
    authCode: string;
}

export interface Tab {
    id: string;
    name: string;
}

export interface BankConnectForMydataRequest {
    bankCodes: string[];
}

export interface ConnectedAccountResponse {
    accountId: number;
    bankName: string;
    accountName: string;
    accountNumber: string;
}