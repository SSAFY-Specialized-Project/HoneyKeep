import { SendEmailRequest } from "@/entities/user/model/types";
import { customFetchAPI } from "@/shared/api";

const sendVerificationAPI = (data: SendEmailRequest) =>
  customFetchAPI<SendEmailRequest, SendEmailRequest>({
    url: "/auth/send-verification",
    method: "POST",
    data,
  });

export default sendVerificationAPI;
