import { ResponseDTO, ResponseErrorDTO } from "@/shared/model/types";
import { apiURL } from "@/shared/lib";
import refreshTokenAPI from "./refreshTokenAPI";

const customFetchAPI = async <T, P> ({
  url,
  method,
  credentials = "same-origin",
  data,
}:{
  url: string;
  method: "GET"| "POST"| "PUT"| "DELETE"| "PATCH";
  credentials?: RequestCredentials,
  data?: P;
}):Promise<ResponseDTO<T>> => {

  const body = data ? JSON.stringify(data) : null;
  const accessToken = localStorage.getItem("accessToken");

  try{

    const response = await fetch(apiURL(url), {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
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

            return customFetchAPI({url, method, credentials, data});

          }

        }catch(refreshError) {

          localStorage.removeItem("accessToken");

          // 토큰 만료 에러 하나 던져줘야 할듯
          
          //

          setTimeout(() => {
            window.location.href = "/landing";
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