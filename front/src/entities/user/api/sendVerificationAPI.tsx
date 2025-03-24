import { ResponseDTO, ResponseErrorDTO } from "@/shared/api/types";
import { SendEmailResponse } from "./types";
import { apiURL } from "@/shared/lib";

const sendVerificationAPI = async (
  data: SendEmailResponse
): Promise<ResponseDTO<SendEmailResponse> | ResponseErrorDTO> => {
  try {
    const response = await fetch(apiURL("/auth/send-verification"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData: ResponseErrorDTO = await response.json();
      return errorData;
    } else {
      const responseData: ResponseDTO<SendEmailResponse> =
        await response.json();
      return responseData;
    }
  } catch (error) {
    const networkError: ResponseErrorDTO = {
      status: 500,
      name: "NetworkError",
      message:
        error instanceof Error
          ? error.message
          : "알수없는 에러가 발생했습니다.",
    };

    return networkError;
  }
};

export default sendVerificationAPI;
