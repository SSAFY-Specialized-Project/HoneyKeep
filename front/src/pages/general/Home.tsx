import {MyAccountInfo} from '@/features/account/ui';
import {Link} from 'react-router';
import {useMutation} from '@tanstack/react-query';
import {generateKeyPair} from "@/entities/certification/lib/generateCeritication.ts";
import {registerCertificateAPI} from "@/entities/certification/api";

const Home = () => {

    const registerMutation = useMutation({
        mutationFn: async () => {
            // 1. 키 쌍 생성
            const {publicKeyBase64} = await generateKeyPair();
            console.log("Generated Public Key:", publicKeyBase64);

            // 2. 서버에 인증서 등록 API 호출
            const response = await registerCertificateAPI({publicKey: publicKeyBase64});
            return response; // 성공 시 응답 반환
        },
        onSuccess: (data) => {
            // 3. 성공 시 처리
            console.log('인증서 등록 성공:', data);
            alert(`인증서 등록 성공! 시리얼 번호: ${data.data.serialNumber}`);
            // 필요하다면 여기서 상태 업데이트나 다른 작업 수행
        },
        onError: (error) => {
            // 4. 실패 시 처리
            console.error('인증서 등록 실패:', error);
            alert(`인증서 등록 실패: ${error.message}`);
        },
    });

    // 버튼 클릭 시 뮤테이션 실행
    const handleRegister = () => {
        registerMutation.mutate();
    };

    return (
        <div className="flex flex-col gap-2 px-5 pt-5">
            {/* 버튼 클릭 시 handleRegister 호출 */}
            <button 
                className="cursor-pointer disabled:opacity-50"
                onClick={handleRegister} 
                disabled={registerMutation.isPending} // 로딩 중일 때 버튼 비활성화
            >
                {registerMutation.isPending ? '등록 중...' : '인증서 발급받기'}
            </button>
            <MyAccountInfo/>
            {/* <MyPocketInfo /> */}
            <Link
                to="/pocket/create"
                className="bg-brand-primary-500 text-title-md mt-3 w-full rounded-2xl py-3 text-center font-bold text-white"
            >
                포켓 만들기
            </Link>
        </div>
    );
};

export default Home;
