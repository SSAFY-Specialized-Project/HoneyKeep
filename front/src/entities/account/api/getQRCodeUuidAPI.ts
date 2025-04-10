import { customFetchAPI } from "@/shared/api";

const getQRCodeUuidAPI = () => customFetchAPI({ url: "/pay/qr", method:"POST"});

export default getQRCodeUuidAPI;