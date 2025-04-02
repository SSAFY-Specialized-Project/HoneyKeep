import {RegisterCertificateRequest} from "@/entities/certification/api/types.ts";
import {customFetchAPI} from "@/shared/api";

interface RegisterCertificateResponse{
    id: number,
    serialNumber: string,
    expiryDate: Date,
    status: string,
}

export const registerCertificateAPI = (
    data: RegisterCertificateRequest
)=> customFetchAPI<RegisterCertificateResponse, RegisterCertificateRequest>({
    url: "/cert/register",
    method: "POST",
    credentials: "include",
    data,
})