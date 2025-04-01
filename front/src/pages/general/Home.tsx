import {generateKeyPair} from "@/entities/certification/lib/generateCeritication.ts";
import registerCertificateAPI from "@/entities/certification/api/registerCertificateAPI.ts";

const Home = () => {
    const handleRegister = async () => {
        const {publicKeyBase64} = await generateKeyPair();
        console.log(publicKeyBase64);
        const response = await registerCertificateAPI({publicKey: publicKeyBase64});
        console.log(response);
    }

    const handleSign = async () => {
        const {publicKeyBase64} = await generateKeyPair();
        console.log(publicKeyBase64);
        const response = await registerCertificateAPI({publicKey: publicKeyBase64});
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
