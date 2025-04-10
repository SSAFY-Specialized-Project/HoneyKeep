import { getAllAccountAPI } from '@/entities/account/api';
import { QRAccount } from '@/entities/account/ui';
import { ContentAddBox } from '@/shared/ui';
import { useQuery } from '@tanstack/react-query';
import { QRCodeCanvas } from 'qrcode.react';
import { useNavigate } from 'react-router';

const QRPayment = () => {
  const navigate = useNavigate();
  const { data: accountData } = useQuery({
    queryFn: getAllAccountAPI,
    queryKey: ['accounts-info'],
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div>
      <div>
        <QRCodeCanvas value="https://www.naver.com" />
        <button type="button"></button>
        {accountData != null && accountData.data.length > 0 ? (
          accountData.data.map((item) => {
            return (
              <QRAccount
                bankName={item.bankName}
                accountName={item.accountName}
                accountId={item.accountId}
                accountBalance={item.accountBalance}
              />
            );
          })
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
  );
};

export default QRPayment;
