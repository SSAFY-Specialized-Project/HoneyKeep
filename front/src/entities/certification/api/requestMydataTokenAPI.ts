import {customFetchAPI} from "@/shared/api";
import {RequestCredentialsRequest} from "@/entities/certification/model/types.ts";

interface RequestCredentialsResponse {
    token: string;
}

export const requestMydataTokenAPI = (
    headers: RequestCredentialsRequest,
) => customFetchAPI<RequestCredentialsResponse, void, RequestCredentialsRequest>({
    url: "/mydata/token",
    method: "POST",
    credentials: "include",
    headers
})