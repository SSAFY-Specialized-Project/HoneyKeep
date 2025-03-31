import { ResponseDTO, ResponseErrorDTO } from "@/shared/model/types";
import { RegisterUserRequest, RegisterUserResponse } from "./types";
import { apiURL } from "@/shared/lib";

const registerUserAPI = async (
  data: RegisterUserRequest 
):Promise<ResponseDTO<RegisterUserResponse>> => {

  try{

    const response = await fetch(apiURL("/auth/register"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    });

    if(!response.ok){

      const responseData:ResponseErrorDTO = await response.json();

      const error = new Error(responseData.message) as Error;

      throw error;
    }

    const responseData: ResponseDTO<RegisterUserResponse> = await response.json();

    return responseData;
  }catch(error){

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

export default registerUserAPI;