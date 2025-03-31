import { ResponseDTO, ResponseErrorDTO } from "@/shared/model/types";
import { apiURL } from "@/shared/lib";

const refreshTokenAPI = async ():Promise<ResponseDTO<string>>  => {

  try{

    const response = await fetch(apiURL("/auth/reissue"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    })

    if(!response.ok){

      const responseData: ResponseErrorDTO = await response.json();

      const error = new Error(responseData.message) as Error & {status: number, name: string}

      error.status = responseData.status;
      error.name = responseData.name;

      throw error;
    }

    const responseData:ResponseDTO<string> = await response.json();

    return responseData;

  }catch(error){

    localStorage.removeItem("accessToken");

    if(error instanceof Error && "status" in error){
      throw error;
    }

    const networkError: ResponseErrorDTO = {
      status: 500,
      name: "NetworkError",
      message: "에기치 못한 에러가 발생했습니다.",
    };

    throw networkError;

  }
}

export default refreshTokenAPI;