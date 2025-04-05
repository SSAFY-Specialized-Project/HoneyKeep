export interface BankAuthForMydataRequest {
    bankCode: string
    accountNo: string
}

export interface BankAuthForMydataResponse {
    transactionUniqueNo: string
    accountNo: string
}

export interface AccountVerifyForMydataRequest {
    accountNo: string
    authCode: string
}
