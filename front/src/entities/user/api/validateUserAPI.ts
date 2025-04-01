import { ValidateUserRequest } from "@/entities/user/model/types";
import { customFetchAPI } from "@/shared/api";

const validateUserAPI = (data: ValidateUserRequest) =>
  customFetchAPI<boolean, ValidateUserRequest>({
    url: "/auth/validate-user",
    method: "POST",
    data,
  });

export default validateUserAPI;
