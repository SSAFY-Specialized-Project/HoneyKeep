import { getAllAccountAPI } from '@/entities/account/api';
import getQRCodeUuidAPI from '@/entities/account/api/getQRCodeUuidAPI';
import { AccountCarousel } from '@/features/account/ui';
import PocketChooseModal from '@/features/pocket/ui/PocketChooseModal';
import { useHeaderStore, usePocketChooseStore } from '@/shared/store';
import { ContentAddBox, Icon } from '@/shared/ui';
import { useQuery } from '@tanstack/react-query';
import { QRCodeCanvas } from 'qrcode.react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const QRPayment = () => {
  const { pocketId, pocketName } = usePocketChooseStore();

  const navigate = useNavigate();
  const { setTitle } = useHeaderStore();
  const [index, setIndex] = useState<number>(0);
  const [account, setAccount] = useState<number | null>(null);
  const [isActive, setActive] = useState<boolean>(false);
  const accessToken = localStorage.getItem('accessToken');
  const { isOpen } = usePocketChooseStore();

  useEffect(() => {
    setTitle('허니페이');
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

  return (
    <>
      <div className="bg-brand-primary-200 h-full px-12 pt-12">
        <div className="flex flex-col items-center justify-center gap-10 rounded-xl bg-white px-10 py-15">
          {isActive ? (
            <QRCodeCanvas
              value={`http://localhost:5173/pay/send?qrcode=${qrcodeData.data.qrCode}&token=${accessToken}&account=${account}&pocketId=${pocketId}`}
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
