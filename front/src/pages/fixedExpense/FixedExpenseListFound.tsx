import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { FixedExpenseFound } from "@/entities/fixedExpense/ui";
import { DetectedFixedExpenseResponse } from "@/entities/fixedExpense/model/types.ts";

// Outlet context 타입 정의
type ContextType = {
    detectedFixedExpenses: DetectedFixedExpenseResponse[];
    setDeleteItemInfo: React.Dispatch<React.SetStateAction<{ id: number; title: string } | null>>;
    setModalType: React.Dispatch<React.SetStateAction<'fixed' | 'detected'>>;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    navigate: ReturnType<typeof useNavigate>;
};

// 문자열에서 숫자만 추출하는 함수
const extractNumberFromString = (str: string): number => {
    const numericValue = str.replace(/[^0-9]/g, '');
    return numericValue ? parseInt(numericValue, 10) : 0;
};

const FixedExpenseListFound = () => {
    const { 
        detectedFixedExpenses, 
        setDeleteItemInfo, 
        setModalType, 
        setIsModalOpen,
        navigate 
    } = useOutletContext<ContextType>();

    const handleDetectedFixedExpenseRegister = (event: React.MouseEvent<HTMLButtonElement>, item: DetectedFixedExpenseResponse) => {
        console.log("발견된 고정지출 등록");
        event.stopPropagation();
        
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
                }
            }
        });
    };

    const handleDetectedFixedExpenseDelete = (event: React.MouseEvent<HTMLButtonElement>, item: DetectedFixedExpenseResponse) => {
        console.log("발견된 고정지출 삭제");
        event.stopPropagation();

        setDeleteItemInfo({
            id: item.id,
            title: item.name
        });
        setModalType('detected');
        setIsModalOpen(true);
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
                    
                    return (
                        <FixedExpenseFound
                            key={item.id}
                            title={item.name}
                            paymentDate={item.averageDay}
                            amount={amount}
                            monthCount={item.transactionCount}
                            onRegister={(event) => handleDetectedFixedExpenseRegister(event, item)}
                            onDelete={(event) => handleDetectedFixedExpenseDelete(event, item)}
                        />
                    );
                })
            )}
        </div>
    );
};

export default FixedExpenseListFound;
