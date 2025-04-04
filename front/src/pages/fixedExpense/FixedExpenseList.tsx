import {useState} from "react";
import {FixedChoiceTab, FixedExpenseTotal} from "@/entities/fixedExpense/ui";
import {NavLink, Outlet, useNavigate} from "react-router-dom";
import BasicModal from "@/widgets/modal/ui/BasicModal.tsx";
import {useMutation, useQueryClient, useSuspenseQuery} from "@tanstack/react-query";
import {DetectedFixedExpenseResponse, FixedExpenseResponse} from "@/entities/fixedExpense/model/types.ts";
import {
    getAllFixedExpensesAPI,
    getAllDetectedFixedExpensesAPI,
    deleteFixedExpenseAPI, deleteDetectedFixedExpenseAPI
} from "@/entities/fixedExpense/api";
import {ResponseDTO} from "@/shared/model/types";

const FixedExpenseList = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteItemInfo, setDeleteItemInfo] = useState<{ id: number, title: string } | null>(null);
    const [modalType, setModalType] = useState<'fixed' | 'detected'>('fixed');

    // 로그인된 유저의 고정지출 목록을 불러온다.
    const {data: fixedExpenses = []} = useSuspenseQuery<ResponseDTO<FixedExpenseResponse[]>, Error, FixedExpenseResponse[]>({
        queryKey: ['fixed-expense-info'],
        queryFn: getAllFixedExpensesAPI,
        select: (response) => response.data,
        staleTime: 30 * 1000,
        gcTime: 60 * 1000,
    });

    // 로그인된 유저의 감지된 고정지출 목록을 불러온다.
    const {data: detectedFixedExpenses = []} = useSuspenseQuery<ResponseDTO<DetectedFixedExpenseResponse[]>, Error, DetectedFixedExpenseResponse[]>({
        queryKey: ['detected-fixed-expense-info'],
        queryFn: getAllDetectedFixedExpensesAPI,
        select: (response) => response.data,
        staleTime: 30 * 1000,
        gcTime: 60 * 1000,
    });

    // 일반 고정지출 삭제 mutation
    const deleteFixedExpenseMutation = useMutation({
        mutationFn: deleteFixedExpenseAPI,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fixed-expense-info'] });
        },
    });

    // 발견된 고정지출 삭제 mutation
    const deleteDetectedFixedExpenseMutation = useMutation({
        mutationFn: deleteDetectedFixedExpenseAPI,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['detected-fixed-expense-info'] });
        },
    });

    // 고정지출 총액 계산
    const totalAmount = fixedExpenses.reduce((sum, item) => sum + item.money.amount, 0);

    // 모달 닫기 핸들러
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setDeleteItemInfo(null);
    };

    // 모달 확인 핸들러
    const handleConfirmDelete = () => {
        if (!deleteItemInfo) return;

        if (modalType === 'fixed') {
            console.log(`고정지출 삭제 API 호출: ID ${deleteItemInfo.id}, 제목 ${deleteItemInfo.title}`);
            deleteFixedExpenseMutation.mutate(deleteItemInfo.id);
        } else {
            console.log(`발견된 고정지출 삭제 API 호출: ID ${deleteItemInfo.id}, 제목 ${deleteItemInfo.title}`);
            deleteDetectedFixedExpenseMutation.mutate(deleteItemInfo.id);
        }

        setIsModalOpen(false);
        setDeleteItemInfo(null);
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-brand-background gap-5 relative">
            {/* 내 고정지출 요약 */}
            <FixedExpenseTotal
                count={fixedExpenses.length}
                totalAmount={totalAmount}
            />

            {/* 탭 */}
            <FixedChoiceTab/>

            {/* 탭 내용 */}
            <Outlet context={{
                fixedExpenses,
                detectedFixedExpenses,
                setDeleteItemInfo,
                setModalType,
                setIsModalOpen,
                navigate
            }}/>


            {/* 고정지출 삭제 확인 모달 */}
            <BasicModal
                isOpen={isModalOpen}
                icon="exclamation-triangle"
                title={modalType === 'fixed' ? "고정지출 삭제" : "발견된 고정지출 삭제"}
                itemName={deleteItemInfo?.title || ""}
                description={modalType === 'fixed'
                    ? "을 고정지출 목록에서 삭제할까요?"
                    : "을 발견된 고정지출 목록에서 삭제할까요?"}
                buttonText="삭제"
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
            />

            {/* 추가 버튼 */}
            <NavLink to="/fixedExpense/create" className="px-4 pb-4">
                <button
                    className="w-full p-4 rounded-lg text-m font-medium bg-yellow-400 hover:bg-yellow-500 text-white cursor-pointer"
                >
                    고정지출 추가하기
                </button>
            </NavLink>
        </div>
    );
};

export default FixedExpenseList;
