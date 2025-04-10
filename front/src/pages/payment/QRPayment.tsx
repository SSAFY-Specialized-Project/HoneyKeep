import { getAllAccountAPI } from '@/entities/account/api';
import getQRCodeUuidAPI from '@/entities/account/api/getQRCodeUuidAPI';
import { AccountCarousel } from '@/features/account/ui';
import PocketChooseModal from '@/features/pocket/ui/PocketChooseModal';
import { useHeaderStore, usePocketChooseStore } from '@/shared/store';
import { ContentAddBox, Icon } from '@/shared/ui';
import { useQuery } from '@tanstack/react-query';
import { QRCodeCanvas } from 'qrcode.react';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useWebAuthnAuthentication } from '@/entities/user/hooks';
import getCredentialsAPI from '@/entities/certification/api/getCredentialsAPI.ts';
import useQRPayStore from '@/shared/store/useQRPayStore';

const QRPayment = () => {
  const { pocketId, pocketName } = usePocketChooseStore();

  const navigate = useNavigate();
  const { setTitle } = useHeaderStore();
  const [index, setIndex] = useState<number>(0);
  const [account, setAccount] = useState<number | null>(null);
  const [isActive, setActive] = useState<boolean>(false);
  const accessToken = localStorage.getItem('accessToken');
  const { isOpen } = usePocketChooseStore();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { startAuthentication } = useWebAuthnAuthentication();
  const isAuthenticating = useRef(false); // 인증 진행 중인지 추적
  const { isSuccess } = useQRPayStore();

  useEffect(() => {
    if (isSuccess) navigate('/qrSuccess');
  }, [isSuccess, navigate]);

  useEffect(() => {
    setTitle('허니페이');

    const checkAuthentication = () => {
      // 이미 인증 중이면 중복 요청 방지
      if (isAuthenticating.current) {
        console.log('인증이 이미 진행 중입니다.');
        return;
      }

      isAuthenticating.current = true;
      setIsCheckingAuth(true);

      console.log('WebAuthn 인증 시작...');

      // Promise 체인으로 인증 흐름 구현
      getCredentialsAPI()
        .then((response) => {
          if (
            !response ||
            !response.data ||
            (Array.isArray(response.data) && response.data.length === 0)
          ) {
            console.log('등록된 꿀킵 인증서가 없습니다. 등록 페이지로 이동합니다.');
            navigate(`/honey-cert/register`);
            throw new Error('no-certificate');
          }

          console.log('등록된 꿀킵 인증서가 있습니다. WebAuthn 인증을 시작합니다.');
          return startAuthentication();
        })
        .then((authResult) => {
          console.log('인증 응답 받음:', authResult);

          if (
            authResult &&
            typeof authResult === 'object' &&
            'data' in authResult &&
            authResult.data?.success
          ) {
            console.log('WebAuthn 인증 성공');
            setIsCheckingAuth(false);
          } else {
            console.warn('WebAuthn 인증 실패:', authResult);
            alert('인증에 실패했습니다. 홈으로 이동합니다.');
            navigate(`/home`);
          }
        })
        .catch((error) => {
          // 의도적으로 던진 에러는 무시
          if (error.message === 'no-certificate') return;

          console.error('WebAuthn 인증 중 오류 발생:', error);
          alert('인증 중 오류가 발생했습니다. 홈으로 이동합니다.');
          navigate('/home', { replace: true });
        })
        .finally(() => {
          isAuthenticating.current = false; // 인증 완료 후 플래그 초기화
        });
    };

    // checkAuthentication();

    return () => {
      // 컴포넌트 언마운트 시 정리 작업
      console.log('QR 결제 페이지 종료');
      isAuthenticating.current = false; // 언마운트 시 플래그 초기화
    };
  }, []);

  useEffect(() => {
    if (!accountData) return;

    setAccount(accountData.data[index].accountId);
  }, [index]);

  const { data: qrcodeData } = useQuery({
    queryFn: getQRCodeUuidAPI,
    queryKey: ['qrcode-uuid'],
    staleTime: 1000 * 60,
  });

  const { data: accountData } = useQuery({
    queryFn: getAllAccountAPI,
    queryKey: ['accounts-info'],
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (!accountData) return;

    setAccount(accountData.data[0].accountId);
  }, [accountData]);

  useEffect(() => {
    setActive(accessToken != null && account != null && pocketId != 0 && qrcodeData != null);
  }, [accessToken, account, pocketId, qrcodeData]);

  // if (isCheckingAuth) {
  //   return (
  //     <div className="flex h-full flex-col items-center justify-center gap-4">
  //       <div className="border-brand-primary-500 h-12 w-12 animate-spin rounded-full border-t-2 border-b-2"></div>
  //       <p className="text-lg font-medium">인증 정보를 확인하는 중...</p>
  //       <p className="text-sm text-gray-500">잠시만 기다려주세요</p>
  //     </div>
  //   );
  // }

  return (
    <>
      <div className="bg-brand-primary-200 h-full px-12 pt-12">
        <div className="flex flex-col items-center justify-center gap-10 rounded-xl bg-white px-10 py-15">
          {isActive ? (
            <QRCodeCanvas
              value={`https://j12a405.p.ssafy.io/pay/send?qrcode=${qrcodeData.data.qrCode}&token=${accessToken}&account=${account}&pocketId=${pocketId}`}
              style={{ width: 256, height: 256 }}
            />
          ) : (
            <div className="h-64 w-64 rounded-xl bg-gray-100"></div>
          )}
          <button type="button" className="cursor-pointer">
            <Icon id="arrow-repeat" size="big" />
          </button>
          <div className="h-40 w-90 overflow-hidden">
            {accountData != null ? (
              <AccountCarousel
                accounts={accountData.data}
                setIndex={setIndex}
                pocketName={pocketName}
              />
            ) : (
              <ContentAddBox
                text="내 자산 추가하기"
                onClick={() => {
                  navigate('/myAgree');
                }}
              />
            )}
          </div>
        </div>
      </div>
      <PocketChooseModal isOpen={isOpen} />
    </>
  );
};

export default QRPayment;
