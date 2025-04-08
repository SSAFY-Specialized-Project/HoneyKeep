import {customFetchAPI} from "@/shared/api";
import {BankConnectForMydataRequest, ConnectedAccountResponse} from "@/features/certification/model/types.ts";

const mydataConnectAPI = (data: BankConnectForMydataRequest) =>
    customFetchAPI<ConnectedAccountResponse[], BankConnectForMydataRequest>({
        url: "/mydata/connect",
        method: "POST",
        credentials: "include",
        data,
    });

export default mydataConnectAPI;
