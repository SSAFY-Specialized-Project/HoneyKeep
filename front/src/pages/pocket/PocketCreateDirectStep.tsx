import { AccountInputDropdown } from '@/entities/account/ui';
import CategoryInputDropDown from '@/entities/category/ui/CategoryInputDropDown';
import { CreatePocketAPI } from '@/entities/pocket/api';
import { convertCurrentTime, formatCurrency } from '@/shared/lib';
import usePocketCreateStore from '@/shared/store/usePocketCreateStore';
import { BorderInput, Icon, ToggleButton } from '@/shared/ui';
import { SearchLoadingModal } from '@/widgets/modal/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

type YYYYMMDD = `${number}-${number}-${number}`;

const PocketCreateStep = () => {
  const {
    name,
    startDate: start,
    endDate: end,
    accountId: account,
    categoryId: category,
    totalAmount,
    savedAmount,
    setStartDate: setStart,
    setEndDate: setEnd,
    setAccountId: setAccount,
    setCategoryId: setCategory,
    setSavedAmount,
  } = usePocketCreateStore();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [isActive, setActive] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [chargeAmount, setChargeAmount] = useState<string>('');

  const [accountId, setAccountId] = useState<number | null>(null);
  const [accountBalance, setAccountBalance] = useState<number | null>(null);
  const [disabled, setDisabled] = useState<boolean>(true);

  const [categoryId, setCategoryId] = useState<number | null>(null);

  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setStart(startDate);
  }, [startDate]);

  useEffect(() => {
    setEnd(endDate);
  }, [endDate]);

  useEffect(() => {
    setSavedAmount(Number(chargeAmount));
  }, [chargeAmount]);

  useEffect(() => {
    if (accountId == null) return;

    setAccount(accountId);
  }, [accountId]);

  useEffect(() => {
    if (categoryId == null) return;
    setCategory(Number(categoryId));
  }, [categoryId]);

  useEffect(() => {
    setDisabled(accountId == null || categoryId == null);
  }, [accountId, categoryId]);

  const handleStartDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.currentTarget.value);
    setEndDate(e.currentTarget.value);
  };

  const handleEndDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.currentTarget.value);
  };

  const handleChargeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^[0-9,]+$/;
    const newValue = e.currentTarget.value.replace(/,/g, '');

    // 비어있거나 숫자로만 구성된 경우에만 값을 업데이트
    if (newValue === '' || /^\d+$/.test(newValue)) {
      setChargeAmount(newValue);
    }
  };

  const createPocketDirectMutate = useMutation({
    mutationFn: CreatePocketAPI,
    onSuccess: (response) => {
      queryClient.setQueryData(['pocket-create-direct'], response.data);
      navigate('/pocket/success');
    },
    onError: () => {
      console.log('생성 실패..');
    },
  });

  const handleCreatePocket = () => {
    if (category == null || account == null) return;

    const newStartDate = start != '' ? convertCurrentTime(start as YYYYMMDD) : null;
    const newEndDate = end != '' ? convertCurrentTime(end as YYYYMMDD) : null;

    const data = {
      name,
      startDate: newStartDate,
      endDate: newEndDate,
      account: {
        id: account,
      },
      categoryId: category,
      totalAmount: {
        amount: totalAmount,
      },
      savedAmount: {
        amount: savedAmount,
      },
    };

    createPocketDirectMutate.mutate(data);
  };

  return (
    <div className="relative flex h-full flex-col gap-4 px-5">
      <div>
        <div className="flex items-center gap-3">
          <Icon size="big" id="money-bag" />
          <h2 className="xs:text-title-xl text-title-md font-bold">포켓 만들기</h2>
        </div>
        <span className="xs:text-title-sm tex-text-lg text-gray-500">
          어떤 지출이 예정되어 있나요?
        </span>
      </div>
      <div className="xs:text-text-md text-text-sm flex items-center gap-3 font-bold text-gray-700">
        <span>지출 예정일</span>
        <ToggleButton isActive={isActive} setActive={setActive} />
      </div>
      <div className={`xs:gap-15 w-full justify-between gap-2 ${isActive ? 'flex' : 'hidden'}`}>
        <BorderInput type="date" label="startDate" value={startDate} onChange={handleStartDate} />
        <BorderInput type="date" label="endDate" value={endDate} onChange={handleEndDate} />
      </div>
      <AccountInputDropdown
        accountId={accountId}
        setAccountId={setAccountId}
        setAccountBalance={setAccountBalance}
      />
      <CategoryInputDropDown categoryId={categoryId} setCategoryId={setCategoryId} />
      <div className="flex flex-col gap-3">
        <BorderInput
          type="text"
          label="amount"
          labelText="채울 금액"
          value={chargeAmount ? formatCurrency(chargeAmount) : ''}
          onChange={handleChargeAmount}
          placeholder="0"
          content={<span className="text-title-sm absolute right-2.5 bottom-3">원</span>}
        />
        {accountBalance != null && accountBalance < Number(chargeAmount) ? (
          <span className="xs:text-text-sm text-text-xs text-warning font-bold">
            계좌 잔액이 포켓 금액보다 적어 비활성화 상태로 생성됩니다.
          </span>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {}}
              className="text-extra xs:text-text-sm text-text-xs xs:h-9 xs:w-25 h-6 w-20 cursor-pointer rounded-sm bg-gray-100 text-center font-semibold"
            >
              나중에 채우기
            </button>
            <button
              type="button"
              onClick={() => {
                setChargeAmount(String(totalAmount));
                setSavedAmount(totalAmount);
              }}
              className="text-extra xs:text-text-sm text-text-xs xs:h-9 xs:w-25 h-6 w-20 cursor-pointer rounded-sm bg-gray-100 text-center font-semibold"
            >
              전액 채우기
            </button>
          </div>
        )}
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={handleCreatePocket}
        className="bg-brand-primary-500 text-text-xl xs:text-title-md mt-auto w-full cursor-pointer rounded-2xl py-3 text-center font-bold text-white disabled:cursor-default disabled:bg-gray-100 disabled:text-gray-400"
      >
        생성하기
      </button>
      <SearchLoadingModal isLoading={isLoading} />
    </div>
  );
};

export default PocketCreateStep;
