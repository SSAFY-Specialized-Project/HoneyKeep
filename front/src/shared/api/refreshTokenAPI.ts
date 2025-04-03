import { apiURL } from "@/shared/lib";
import customFetchAPI from "./customFetchAPI";

const refreshTokenAPI = () => customFetchAPI<string, string>({url: apiURL("/auth/reissue"), method: "POST", credentials: "include"})

export default refreshTokenAPI;