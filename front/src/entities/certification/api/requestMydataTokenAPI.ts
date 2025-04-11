import {customFetchAPI} from "@/shared/api";
import {RequestCredentialsRequest, RequestCredentialsResponse} from "@/entities/certification/model/types.ts";

const requestMydataTokenAPI = (
    headers: RequestCredentialsRequest,
) => customFetchAPI<RequestCredentialsResponse, void, RequestCredentialsRequest>({
    url: "/mydata/token",
    method: "POST",
    credentials: "include",
    headers
})

export default requestMydataTokenAPI;