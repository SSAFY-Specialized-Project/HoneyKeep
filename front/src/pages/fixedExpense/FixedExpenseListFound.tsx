import React, { MouseEvent } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { FixedExpenseFound } from "@/entities/fixedExpense/ui";
import { DetectedFixedExpenseResponse } from "@/entities/fixedExpense/model/types.ts";
import { useBasicModalStore } from "@/shared/store";
import { UseMutateFunction } from '@tanstack/react-query';
import { ResponseDTO, ResponseErrorDTO } from '@/shared/model/types';

// Outlet context 타입 정의
type ContextType = {
    detectedFixedExpenses: DetectedFixedExpenseResponse[];
    navigate: ReturnType<typeof useNavigate>;
    isEditMode?: boolean;
    deleteDetectedExpense: UseMutateFunction<ResponseDTO<void>, ResponseErrorDTO | Error, number, unknown>;
    deleteFixedExpense?: UseMutateFunction<ResponseDTO<void>, ResponseErrorDTO | Error, number, unknown>;
};

// 문자열에서 숫자만 추출하는 함수
const extractNumberFromString = (str: string): number => {
    const numericValue = str.replace(/[^0-9]/g, '');
    return numericValue ? parseInt(numericValue, 10) : 0;
};

const FixedExpenseListFound = () => {
    const {
        detectedFixedExpenses,
        navigate,
        deleteDetectedExpense
    } = useOutletContext<ContextType>();

    const { openModal, closeModal } = useBasicModalStore();

    const handleDetectedFixedExpenseRegister = (item: DetectedFixedExpenseResponse) => {
        // 문자열에서 숫자만 추출
        const amount = extractNumberFromString(item.averageAmount);
        
        navigate('/fixedExpense/create', {
            state: {
                mode: 'REGISTER',
                initialData: {
                    id: item.id,
                    name: item.name,
                    amount: amount,
                    payDay: item.averageDay,
                    memo: "",
                    accountNumber: item.account.accountNumber,
                    transactionCount: item.transactionCount || 1
                }
            }
        });
    };

    const handleDetectedFixedExpenseDelete = (item: DetectedFixedExpenseResponse) => {
        openModal({
            icon: "exclamation-triangle",
            title: '발견된 고정지출 삭제',
            itemName: item.name,
            description: '을 발견된 고정지출 목록에서 삭제할까요?',
            buttonText: '삭제',
            onConfirm: (e: React.MouseEvent) => {
                e.preventDefault();
                deleteDetectedExpense(item.id);
                closeModal();
            }
        });
    };

    return (
        <div className="flex-1 overflow-auto p-4 space-y-4">
            {detectedFixedExpenses.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <p>발견된 고정지출이 없습니다.</p>
                </div>
            ) : (
                detectedFixedExpenses.map(item => {
                    // 각 항목마다 문자열에서 숫자 추출
                    const amount = extractNumberFromString(item.averageAmount);
                    
                    // transactionCount가 없거나 0인 경우 기본값 1 설정
                    const monthCount = item.transactionCount || 1;
                    
                    return (
                        <FixedExpenseFound
                            key={item.id}
                            title={item.name}
                            paymentDate={item.averageDay}
                            amount={amount}
                            monthCount={monthCount}
                            onRegister={() => handleDetectedFixedExpenseRegister(item)}
                            onDelete={() => handleDetectedFixedExpenseDelete(item)}
                        />
                    );
                })
            )}
        </div>
    );
};

export default FixedExpenseListFound;
