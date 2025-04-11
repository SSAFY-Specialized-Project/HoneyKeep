import { SendEmailCodeRequest } from "@/entities/user/model/types";
import { customFetchAPI } from "@/shared/api";

const verifyEmailCodeAPI = (data: SendEmailCodeRequest) =>
  customFetchAPI<boolean, SendEmailCodeRequest>({
    url: "/auth/verify-email",
    method: "POST",
    data,
  });

export default verifyEmailCodeAPI;
