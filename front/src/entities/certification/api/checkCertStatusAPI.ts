import {customFetchAPI} from "@/shared/api";

interface CertStatusResponse {
    status: string;
    serialNumber: string;
    expiryDate: Date;
    issueDate: Date;
}

export const checkCertStatusAPI = (

) => customFetchAPI<CertStatusResponse, void>({
    url: "/cert/status",
    method: "POST",
    credentials: "include",
})