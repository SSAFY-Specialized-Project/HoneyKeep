import {customFetchAPI} from "@/shared/api";
import {WebAuthnCredentialsResponse} from "@/entities/certification/model/types.ts";

const getCredentialsAPI = () =>
    customFetchAPI<WebAuthnCredentialsResponse, void>({
        url: "/webauthn/credentials",
        method: "GET",
        credentials: "include",
    });

export default getCredentialsAPI;