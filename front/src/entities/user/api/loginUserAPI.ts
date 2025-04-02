import {
  LoginUserRequset,
  LoginUserResponse,
} from "@/entities/user/model/types";
import { customFetchAPI } from "@/shared/api";

const loginUserAPI = (data: LoginUserRequset) =>
  customFetchAPI<LoginUserResponse, LoginUserRequset>({
    url: "/auth/login",
    method: "POST",
    data,
  });

export default loginUserAPI;
