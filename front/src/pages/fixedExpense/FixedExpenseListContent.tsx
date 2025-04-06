import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { FixedExpenseInfo } from "@/entities/fixedExpense/ui";
import { FixedExpenseResponse } from "@/entities/fixedExpense/model/types.ts";

// Outlet context 타입 정의
type ContextType = {
    fixedExpenses: FixedExpenseResponse[];
    setDeleteItemInfo: React.Dispatch<React.SetStateAction<{ id: number; title: string } | null>>;
    setModalType: React.Dispatch<React.SetStateAction<'fixed' | 'detected'>>;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    navigate: ReturnType<typeof useNavigate>;
    isEditMode: boolean;
};

const FixedExpenseListContent = () => {
    const { 
        fixedExpenses, 
        setDeleteItemInfo, 
        setModalType, 
        setIsModalOpen,
        navigate,
        isEditMode
    } = useOutletContext<ContextType>();

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
                    memo: item.memo || "",
                    accountNumber: item.account.accountNumber,
                    transactionCount: item.transactionCount
                }
            }
        });
    };

    const handleFixedExpenseDelete = (item: FixedExpenseResponse) => {
        setDeleteItemInfo({
            id: item.id,
            title: item.name
        });
        setModalType('fixed');
        setIsModalOpen(true);
    };

    return (
        <div className="flex-1 overflow-auto p-4 space-y-4">
            {fixedExpenses.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <p>등록된 고정지출이 없습니다.</p>
                    <p className="mt-2">아래 '고정지출 추가하기' 버튼을 눌러 등록해보세요.</p>
                </div>
            ) : (
                fixedExpenses.map(item => {
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
