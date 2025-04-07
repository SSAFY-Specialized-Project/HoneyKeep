import customFetchAPI from "./customFetchAPI";

const refreshTokenAPI = () => customFetchAPI<string, string>({url: "/auth/reissue", method: "POST", credentials: "include"})

export default refreshTokenAPI;