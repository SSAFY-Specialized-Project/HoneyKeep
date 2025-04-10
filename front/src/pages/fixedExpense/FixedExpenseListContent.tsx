import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { FixedExpenseInfo } from '@/entities/fixedExpense/ui';
import { FixedExpenseResponse } from '@/entities/fixedExpense/model/types.ts';
import { useBasicModalStore } from '@/shared/store';
import { UseMutateFunction } from '@tanstack/react-query';
import { ResponseDTO, ResponseErrorDTO } from '@/shared/model/types';

// Outlet context 타입 정의
type ContextType = {
  fixedExpenses: FixedExpenseResponse[];
  navigate: ReturnType<typeof useNavigate>;
  isEditMode: boolean;
  deleteFixedExpense: UseMutateFunction<
    ResponseDTO<void>,
    ResponseErrorDTO | Error,
    number,
    unknown
  >;
  deleteDetectedExpense: UseMutateFunction<
    ResponseDTO<void>,
    ResponseErrorDTO | Error,
    number,
    unknown
  >;
};

const FixedExpenseListContent = () => {
  const { fixedExpenses, navigate, isEditMode, deleteFixedExpense } =
    useOutletContext<ContextType>();

  const { openModal, closeModal } = useBasicModalStore();

  const handleFixedExpenseDetail = () => {
    // TODO: FixedExpenseDetail 페이지로 네비게이트.
  };

  const handleFixedExpenseModify = (item: FixedExpenseResponse) => {
    navigate('/fixedExpense/create', {
      state: {
        mode: 'MODIFY',
        initialData: {
          id: item.id,
          name: item.name,
          amount: item.money.amount,
          payDay: item.payDay,
          memo: item.memo || '',
          accountNumber: item.account.accountNumber,
          transactionCount: item.transactionCount,
        },
      },
    });
  };
  const handleFixedExpenseDelete = (item: FixedExpenseResponse) => {
    openModal({
      icon: 'exclamation-triangle',
      title: '고정지출 삭제',
      itemName: item.name,
      description: '을 고정지출 목록에서 삭제할까요?',
      buttonText: '삭제',
      onConfirm: (e: React.MouseEvent) => {
        e.preventDefault();
        deleteFixedExpense(item.id);
        closeModal();
      },
    });
  };

  return (
    <div className="flex-1 space-y-4 overflow-auto p-4">
      {fixedExpenses.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center text-gray-500">
          <p>등록된 고정지출이 없습니다.</p>
          <p className="mt-2">아래 '고정지출 추가하기' 버튼을 눌러 등록해보세요.</p>
        </div>
      ) : (
        fixedExpenses.map((item) => {
          const monthCount = item.transactionCount || 1;

          return (
            <FixedExpenseInfo
              key={item.id}
              title={item.name}
              paymentDate={item.payDay}
              amount={item.money.amount}
              monthCount={monthCount}
              onClick={handleFixedExpenseDetail}
              onModify={() => handleFixedExpenseModify(item)}
              onDelete={() => handleFixedExpenseDelete(item)}
              showButtons={isEditMode}
            />
          );
        })
      )}
    </div>
  );
};

export default FixedExpenseListContent;
