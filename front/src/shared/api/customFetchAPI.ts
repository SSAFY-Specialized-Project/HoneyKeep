import { ResponseDTO, ResponseErrorDTO } from "@/shared/model/types";
import { apiURL } from "@/shared/lib";
import refreshTokenAPI from "./refreshTokenAPI";

const customFetchAPI = async <T, P, H extends Record<string, string> = Record<string, string>> ({
  url,
  method,
  credentials = "same-origin",
  data,
  headers,
  end = "Java"
}:{
  url: string;
  method: "GET"| "POST"| "PUT"| "DELETE"| "PATCH";
  credentials?: RequestCredentials,
  data?: P;
  headers?: H;
  end?: "Java" | "Python"
}):Promise<ResponseDTO<T>> => {

  const body = data ? JSON.stringify(data) : null;
  const accessToken = localStorage.getItem("accessToken");
  const makeURL = end == "Java" ? apiURL(url) : `https://j12a405.p.ssafy.io/api/v2${url}`

  try{

    const defaultHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    const mergedHeaders = { ...defaultHeaders, ...headers };

    const response = await fetch(makeURL, {
      method,
      headers: mergedHeaders,
      credentials,
      body: body
    })

    if(!response.ok){
      // 에러 전달 받을 시

      const responseData: ResponseErrorDTO = await response.json();

      if(responseData.status === 401){
    
        try {

          const refreshResponse = await refreshTokenAPI();

          if(refreshResponse.data) {

            localStorage.setItem("accessToken", refreshResponse.data);

            return customFetchAPI({url, method, credentials, data, headers, end});

          }

        }catch(refreshError) {

          localStorage.removeItem("accessToken");

          // 토큰 만료 에러 하나 던져줘야 할듯
          
          //

          setTimeout(() => {
            window.location.href = "/";
          }, 0);
          
          if(refreshError instanceof Error && "status" in refreshError){
            throw refreshError;
          }
      
          const authError: ResponseErrorDTO = {
            status: 401,
            name: "AuthRequiredError",
            message: "토큰이 만료됐습니다.",
          }

          throw authError 

        }

      }

      const error = new Error(responseData.message) as Error & {status: number, name: string};

      error.status = responseData.status;
      error.name = responseData.name;

      throw error;
    }

    const responseData:ResponseDTO<T> = await response.json();

    return responseData;

  }catch(error){

    if(error instanceof Error && "status" in error){
      throw error;
    }

    const networkError: ResponseErrorDTO = {
      status: 500,
      name: "NetworkError",
      message: "예기치 못한 에러가 발생했습니다.",
    }

    throw networkError
  }

}

export default customFetchAPI;