import {customFetchAPI} from "@/shared/api";
import {AccountVerifyForMydataRequest} from "@/features/certification/model/types.ts";

const verifyAccountAuthAPI = (data: AccountVerifyForMydataRequest) =>
    customFetchAPI<void, AccountVerifyForMydataRequest>({
        url: "/cert/accounts/verify",
        method: "POST",
        data,
    })

export default verifyAccountAuthAPI;