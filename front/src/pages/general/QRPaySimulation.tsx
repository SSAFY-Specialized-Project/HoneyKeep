import makeQRPaymentAPI from '@/entities/account/api/makeQRPaymentAPI';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useLocation } from 'react-router';

const QRPaySimulation = () => {
  const location = useLocation();
  const [productName, setProductName] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPayed, setPayed] = useState(false);

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
      setIsSubmitting(false);
      // 결제 후 입력 필드 초기화
      setProductName('');
      setAmount('');
      setPayed(true);
    },
    onError: () => {
      alert('결제 실패..');
      setIsSubmitting(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!productName.trim() || !amount.trim()) {
      alert('상품명과 금액을 모두 입력해주세요.');
      return;
    }

    if (qrcode == null || token == null) {
      alert('QR 코드와 토큰 정보가 필요합니다.');
      return;
    }

    const payData = {
      accountId: Number(account),
      pocketId: Number(pocketId),
      productName: productName,
      amount: Number(amount),
      uuid: qrcode,
    };

    setIsSubmitting(true);
    qrPayMutation.mutate({ data: payData, accessToken: token });
  };

  if (isPayed) return null;

  return (
    <div className="mx-auto max-w-md p-5">
      <h2 className="mb-5 text-center text-xl font-bold">결제 정보 입력</h2>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div>
          <label htmlFor="productName" className="mb-1 block font-semibold">
            상품명
          </label>
          <input
            type="text"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="상품명을 입력하세요"
            className="w-full rounded border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="amount" className="mb-1 block font-semibold">
            금액 (원)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="결제 금액을 입력하세요"
            className="w-full rounded border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`mt-2 rounded bg-blue-500 p-3 font-bold text-white ${isSubmitting ? 'cursor-not-allowed opacity-70' : 'hover:bg-blue-600'}`}
        >
          {isSubmitting ? '결제 처리 중...' : '결제하기'}
        </button>
      </form>
    </div>
  );
};

export default QRPaySimulation;
