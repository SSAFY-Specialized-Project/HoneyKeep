import {RegisterCertificateRequest, RegisterCertificateResponse} from "@/entities/certification/model/types.ts";
import {customFetchAPI} from "@/shared/api";

const registerCertificateAPI = (
    data: RegisterCertificateRequest
)=> customFetchAPI<RegisterCertificateResponse, RegisterCertificateRequest>({
    url: "/cert/register",
    method: "POST",
    credentials: "include",
    data,
})

export default registerCertificateAPI;