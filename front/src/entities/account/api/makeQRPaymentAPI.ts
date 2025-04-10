import { customFetchAPI } from "@/shared/api";
import { QRPaymentRequest } from "../model/types";

const makeQRPaymentAPI = (
  {data, accessToken}: {data: QRPaymentRequest, accessToken: string}
) => customFetchAPI<boolean, QRPaymentRequest>({
  url: "/pay/payment", 
  method:"POST", 
  data, 
  headers: {Authorization: `Bearer ${accessToken}`}
});

export default makeQRPaymentAPI;