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
};

const FixedExpenseListContent = () => {
    const { 
        fixedExpenses, 
        setDeleteItemInfo, 
        setModalType, 
        setIsModalOpen,
        navigate 
    } = useOutletContext<ContextType>();

    // FixedExpenseResponse를 UI에 맞는 형태로 변환하는 함수
    const mapToUIFormat = (item: FixedExpenseResponse) => {
        // payDay에서 일(day)만 추출 (YYYY-MM-DD 형식에서)
        const paymentDay = item.payDay.split('-')[2];
        
        // 얼마나 오래 지속되었는지 계산 (임시로 고정값 사용, 실제로는 계산 필요)
        const monthsSince = 4; // TODO: startDate와 현재 날짜로 계산하는 로직 추가
        
        return {
            id: item.id,
            title: item.name,
            paymentDate: paymentDay,
            amount: item.money.amount,
            monthCount: monthsSince,
            bankName: item.bankName,
            accountName: item.accountName,
            memo: item.memo
        };
    };

    const handleFixedExpenseDetail = () => {
        console.log("고정지출 상세 보기");
        // TODO: FixedExpenseDetail 페이지로 네비게이트.
    };

    const handleFixedExpenseModify = (event: React.MouseEvent<HTMLButtonElement>, item: any) => {
        console.log("고정지출 수정");
        event.stopPropagation();

        navigate('/fixedExpense/create', {
            state: {
                mode: 'MODIFY',
                initialData: {
                    title: item.title,
                    amount: item.amount,
                    paymentDate: parseInt(item.paymentDate),
                    memo: item.memo || ""
                }
            }
        });
    };

    const handleFixedExpenseDelete = (event: React.MouseEvent<HTMLButtonElement>, item: any) => {
        console.log("고정지출 삭제");
        event.stopPropagation();

        setDeleteItemInfo({
            id: item.id,
            title: item.title
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
                    const uiItem = mapToUIFormat(item);
                    return (
                        <FixedExpenseInfo
                            key={uiItem.id}
                            title={uiItem.title}
                            paymentDate={uiItem.paymentDate}
                            amount={uiItem.amount}
                            monthCount={uiItem.monthCount}
                            onClick={handleFixedExpenseDetail}
                            onModify={(event) => handleFixedExpenseModify(event, uiItem)}
                            onDelete={(event) => handleFixedExpenseDelete(event, uiItem)}
                        />
                    );
                })
            )}
        </div>
    );
};

export default FixedExpenseListContent;
