import {UserResponse} from "@/entities/user/model/types";
import {customFetchAPI} from "@/shared/api";

const getMeAPI = () =>
    customFetchAPI<UserResponse, void>({
        url: "/users/me",
        method: "GET",
        credentials: "include"
    });

export default getMeAPI;
