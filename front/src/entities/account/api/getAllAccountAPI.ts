import { ResponseDTO, ResponseErrorDTO } from "@/shared/model/types";
import { AccountDTO } from "../model/types";
import { apiURL } from "@/shared/lib";


const getAllAccountAPI = async ():Promise<ResponseDTO<AccountDTO[]>> => {

  const accessToken = localStorage.getItem("accessToken");

  try{

    const response = await fetch(apiURL("/accounts/"), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      }
    })

    if(!response.ok){

      const responseData: ResponseErrorDTO = await response.json();

      const error = new Error(responseData.message) as Error & {status: number, name: string}

      error.status = responseData.status;
      error.name = responseData.name;

      throw error;

    }

    const responseData:ResponseDTO<AccountDTO[]> = await response.json();

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

export default getAllAccountAPI;