import { useEffect, useState } from 'react';
import { FixedChoiceTab, FixedExpenseTotal } from '@/entities/fixedExpense/ui';
import { NavLink, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import BasicModal from '@/widgets/modal/ui/BasicModal.tsx';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import {
  DetectedFixedExpenseResponse,
  FixedExpenseResponse,
} from '@/entities/fixedExpense/model/types.ts';
import {
  getAllFixedExpensesAPI,
  getAllDetectedFixedExpensesAPI,
  deleteFixedExpenseAPI,
  deleteDetectedFixedExpenseAPI,
} from '@/entities/fixedExpense/api';
import { ResponseDTO } from '@/shared/model/types';
import { useHeaderStore } from '@/shared/store';

const FixedExpenseList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { setContent, setTitle } = useHeaderStore();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteItemInfo, setDeleteItemInfo] = useState<{ id: number; title: string } | null>(null);
  const [modalType, setModalType] = useState<'fixed' | 'detected'>('fixed');

  const isFixedExpenseListTab =
    location.pathname === '/fixedExpense/list' || location.pathname === '/fixedExpense';

  // 편집 모드 토글 함수
  const toggleEditMode = () => {
    if (!isFixedExpenseListTab) return;

    setIsEditMode((prev) => !prev);
  };

  useEffect(() => {
    // 발견된 고정지출 탭으로 이동하면 편집 모드 해제
    if (!isFixedExpenseListTab && isEditMode) {
      setIsEditMode(false);
    }

    // 헤더 설정 업데이트
    updateHeaderContent();

    return () => {
      setTitle('');
      setContent(null);
    };
  }, [isEditMode, location.pathname, setTitle, setContent]);

  // 헤더 내용 업데이트 함수
  const updateHeaderContent = () => {
    setTitle('고정지출');

    setContent(
      <button
        type="button"
        className={`rounded-lg bg-gray-100 px-5 py-2 text-sm font-bold text-nowrap text-gray-700${
          isFixedExpenseListTab
            ? 'cursor-pointer text-gray-700'
            : 'visibility-hidden cursor-default'
        }`}
        style={{
          visibility: isFixedExpenseListTab ? 'visible' : 'hidden',
        }}
        onClick={toggleEditMode}
        disabled={!isFixedExpenseListTab}
      >
        {isEditMode ? '완료' : '관리'}
      </button>,
    );
  };

  // 로그인된 유저의 고정지출 목록을 불러온다.
  const { data: fixedExpenses = [] } = useSuspenseQuery<
    ResponseDTO<FixedExpenseResponse[]>,
    Error,
    FixedExpenseResponse[]
  >({
    queryKey: ['fixed-expense-info'],
    queryFn: getAllFixedExpensesAPI,
    select: (response) => response.data,
    staleTime: 30 * 1000,
    gcTime: 60 * 1000,
  });

  // 로그인된 유저의 감지된 고정지출 목록을 불러온다.
  const { data: detectedFixedExpenses = [] } = useSuspenseQuery<
    ResponseDTO<DetectedFixedExpenseResponse[]>,
    Error,
    DetectedFixedExpenseResponse[]
  >({
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
      deleteFixedExpenseMutation.mutate(deleteItemInfo.id);
    } else {
      deleteDetectedFixedExpenseMutation.mutate(deleteItemInfo.id);
    }

    setIsModalOpen(false);
    setDeleteItemInfo(null);
  };

  return (
    <div className="relative flex h-full flex-1 flex-col gap-5 px-5">
      {/* 내 고정지출 요약 */}
      <FixedExpenseTotal count={fixedExpenses.length} totalAmount={totalAmount} />

      {/* 탭 */}
      <FixedChoiceTab detectedFixedExpenses={detectedFixedExpenses} />

      {/* 탭 내용 */}
      <Outlet
        context={{
          fixedExpenses,
          detectedFixedExpenses,
          setDeleteItemInfo,
          setModalType,
          setIsModalOpen,
          navigate,
          isEditMode,
        }}
      />

      {/* 고정지출 삭제 확인 모달 */}
      <BasicModal
        isOpen={isModalOpen}
        icon="exclamation-triangle"
        title={modalType === 'fixed' ? '고정지출 삭제' : '발견된 고정지출 삭제'}
        itemName={deleteItemInfo?.title || ''}
        description={
          modalType === 'fixed'
            ? '을 고정지출 목록에서 삭제할까요?'
            : '을 발견된 고정지출 목록에서 삭제할까요?'
        }
        buttonText="삭제"
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />

      {/* 추가 버튼 (고정지출 목록 탭이면서 편집 모드가 아닐 때만 표시) */}
      {isFixedExpenseListTab && !isEditMode && (
        <Link
          to="/fixedExpense/create"
          className="bg-brand-primary-500 text-title-md mt-3 mt-auto w-full cursor-pointer rounded-2xl py-3 text-center font-bold text-white"
        >
          고정지출 추가하기
        </Link>
      )}
    </div>
  );
};

export default FixedExpenseList;
