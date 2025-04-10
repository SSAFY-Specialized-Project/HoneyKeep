import makeQRPaymentAPI from '@/entities/account/api/makeQRPaymentAPI';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useLocation } from 'react-router';

const QRPaySimulation = () => {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);

  const qrcode = queryParams.get('qrcode');
  const token = queryParams.get('token');
  const account = queryParams.get('account');
  const pocketId = queryParams.get('pocketId');

  console.log('QR Code:', qrcode);
  console.log('Token:', token);
  console.log('Account:', account);
  console.log('Pocket ID:', pocketId);

  const qrPayMutation = useMutation({
    mutationFn: makeQRPaymentAPI,
    onSuccess: () => {
      alert('결제 성공!');
    },
    onError: () => {
      alert('결제 실패..');
    },
  });

  useEffect(() => {
    if (qrcode == null || token == null) return;

    const payData = {
      accountId: Number(account),
      pocketId: Number(pocketId),
      productName: '차홍룸 강남점',
      amount: 200000,
      uuid: qrcode,
    };

    qrPayMutation.mutate({ data: payData, accessToken: token });
  }, []);

  return <div>페이 페이지</div>;
};

export default QRPaySimulation;
