import {customFetchAPI} from "@/shared/api";
import {BankAuthForMydataRequest, BankAuthForMydataResponse} from "@/features/certification/model/types.ts";

const requestAccountAuthAPI = (data: BankAuthForMydataRequest) =>
    customFetchAPI <BankAuthForMydataResponse, BankAuthForMydataRequest>({
        url: "/cert/accounts/auth",
        method: "POST",
        data,
    })

export default requestAccountAuthAPI;