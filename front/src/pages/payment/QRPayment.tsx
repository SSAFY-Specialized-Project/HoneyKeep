import { getAllAccountAPI } from '@/entities/account/api';
import { AccountCarousel } from '@/features/account/ui';
import { useHeaderStore } from '@/shared/store';
import { ContentAddBox, Icon } from '@/shared/ui';
import { useQuery } from '@tanstack/react-query';
import { QRCodeCanvas } from 'qrcode.react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const QRPayment = () => {
  const navigate = useNavigate();
  const { setTitle } = useHeaderStore();
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    setTitle('허니페이');
  }, []);

  useEffect(() => {
    console.log(index);
  }, [index]);

  const { data: accountData } = useQuery({
    queryFn: getAllAccountAPI,
    queryKey: ['accounts-info'],
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className="bg-brand-primary-200 h-full px-12 pt-12">
      <div className="flex flex-col items-center justify-center gap-10 rounded-xl bg-white px-10 py-15">
        <QRCodeCanvas value="https://www.naver.com" style={{ width: 256, height: 256 }} />
        <button type="button" className="cursor-pointer">
          <Icon id="arrow-repeat" size="big" />
        </button>
        <div className="h-40 w-90 overflow-hidden">
          {accountData != null ? (
            <AccountCarousel accounts={accountData.data} setIndex={setIndex} />
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
  );
};

export default QRPayment;
