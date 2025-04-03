import { createPocketLinkAPI } from '@/entities/pocket/api';
import { BorderInput } from '@/shared/ui';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router';

const PocketCreateLink = () => {
  const [url, setURL] = useState<string>('');
  const navigate = useNavigate();

  const sendURLMutation = useMutation({
    mutationFn: createPocketLinkAPI,
    onSuccess: (response) => {
      const data = response.data;

      if (!data) return;

      const productUuid = data.productUuid;

      console.log('성공', productUuid);

      navigate('/pocket/create/step', { state: productUuid });
    },
    onError: () => {},
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setURL(e.currentTarget.value);
  };

  const handleURL = () => {
    sendURLMutation.mutate({ link: url });
  };

  return (
    <div className="flex h-full flex-col gap-6">
      <p className="font-semibold text-gray-500">
        입력한 링크로 상품 정보를 불러올게요.
        <br />
        상품 정보를 다 불러오면 알림을 보내드릴게요!
        <br />
        평균 30초 ~ 1분 정도 소요됩니다.
      </p>
      <BorderInput
        type="text"
        label="url"
        labelText="URL"
        placeholder="구매할 상품 링크를 입력하세요."
        value={url}
        onChange={handleChange}
        regText=""
      />
      <button
        type="button"
        disabled={url.length == 0}
        onClick={handleURL}
        className="bg-brand-primary-500 text-title-md mt-auto w-full cursor-pointer rounded-2xl py-3 text-center font-bold text-white disabled:cursor-default disabled:bg-gray-100 disabled:text-gray-400"
      >
        다음으로
      </button>
    </div>
  );
};

export default PocketCreateLink;
