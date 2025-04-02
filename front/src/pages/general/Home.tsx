import {generateKeyPair} from "@/entities/certification/lib/generateCeritication.ts";
import {registerCertificateAPI} from "@/entities/certification/api/registerCertificateAPI.ts";
import {createSignatureHeader} from "@/utils/crypto.ts";
import {requestMydataTokenAPI} from "@/entities/certification/api";
import {useEffect, useState} from "react";
import {useQuery} from "@tanstack/react-query";

const Home = () => {
    const [key, setKey] = useState<string>("");

    const {data: registerData} = useQuery({
        queryKey: ["registerData"],
        queryFn: () => registerCertificateAPI({publicKey: key}),
        staleTime: 60 * 1000,
        retry: 5000,
        enabled: !!key
    });

    useEffect(() => {

        if (!registerData) return;

        console.log("registerData", registerData);

    }, [registerData]);

    const handleRegister = async () => {
        const {publicKeyBase64} = await generateKeyPair();
        setKey(publicKeyBase64);
    }

    // TODO: 마이데이터 연동 토큰요청, 결제요청, 이체요청
    const handleSign = async () => {
        const signatureHeaders = await createSignatureHeader('POST', '/api/v1/mydata/token', null);
        const response = await requestMydataTokenAPI(signatureHeaders);
        console.log(response);
    }

    return (
        <div className="flex flex-col gap-2">
            <button className="cursor-pointer" onClick={handleRegister}>
                하이
            </button>
            <button className="cursor-pointer" onClick={handleSign}>
                ㅇㅇ
            </button>
        </div>
    );
};

export default Home;
