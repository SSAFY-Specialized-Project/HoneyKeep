import { RegisterUserRequest, RegisterUserResponse } from "./types";
import { customFetchAPI } from '@/shared/api';

const registerUserAPI = (data:RegisterUserRequest) => customFetchAPI<RegisterUserResponse, RegisterUserRequest>({
  url: "/auth/register",
  method: "POST",
  data
})

export default registerUserAPI;