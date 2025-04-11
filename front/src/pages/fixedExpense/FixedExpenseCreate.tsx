import React, {useState, useEffect} from 'react';
import {BorderInput} from '@/shared/ui';
import {useNavigate, useLocation} from 'react-router-dom';
import {useMutation, useQueryClient, useSuspenseQuery} from '@tanstack/react-query';
import {
    createFixedExpenseAPI,
    updateFixedExpenseAPI,
    approveDetectedFixedExpenseAPI,
} from '@/entities/fixedExpense/api';
import {FixedExpenseRequest} from '@/entities/fixedExpense/model/types';
import {formatCurrency} from '@/shared/lib';
import {getAllAccountAPI} from '@/entities/account/api';
import {Account} from '@/entities/account/model/types';
import {ResponseDTO} from '@/shared/model/types';

type Mode = 'REGISTER' | 'MODIFY' | 'ADD';

type Props = {
    mode?: Mode;
    initialData?: {
        id?: number;
        name: string;
        amount: number;
        payDay: number;
        memo: string;
        accountNumber: string;
        transactionCount?: number;
    };
};

const FixedExpenseCreate = ({mode: propMode, initialData: propInitialData}: Props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();

    // location.state에서 mode와 initialData를 받아옴 (있는 경우에만)
    const stateMode = location.state?.mode;
    const stateInitialData = location.state?.initialData;

    // props로 받은 값과 state로 받은 값 중에서 우선순위 결정 (state > props > default)
    const mode = stateMode || propMode || 'REGISTER';
    const initialData = stateInitialData || propInitialData;

    // 계좌 목록 가져오기
    const {data: accounts = [], isLoading: isLoadingAccounts} = useSuspenseQuery<
        ResponseDTO<Account[]>,
        Error,
        Account[]
    >({
        queryKey: ['accounts'],
        queryFn: getAllAccountAPI,
        select: (response) => response.data,
        staleTime: 5 * 60 * 1000, // 5분
    });

    const [formData, setFormData] = useState({
        id: initialData?.id,
        name: initialData?.name || '',
        amount: initialData?.amount || 0,
        payDay: initialData?.payDay || 1,
        transactionCount: initialData?.transactionCount || 1,
        memo: initialData?.memo || '',
        accountNumber: initialData?.accountNumber || '',
    });

    // 초기 계좌 설정
    useEffect(() => {
        if (accounts.length > 0 && !formData.accountNumber) {
            const initialAccount = initialData?.accountNumber
                ? accounts.find((acc) => acc.accountNumber === initialData.accountNumber)
                : accounts[0];

            if (initialAccount) {
                setFormData((prev) => ({
                    ...prev,
                    accountNumber: initialAccount.accountNumber,
                }));
            }
        }
    }, [accounts, initialData, formData.accountNumber]);

    // 1. 고정지출 생성 mutation
    const createFixedExpenseMutation = useMutation({
        mutationFn: (data: FixedExpenseRequest) => createFixedExpenseAPI(data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['fixed-expense-info']});
            navigate('/fixedExpense/list');
        },
    });

    // 2. 고정지출 수정 mutation
    const updateFixedExpenseMutation = useMutation({
        mutationFn: (params: { id: number; data: FixedExpenseRequest }) =>
            updateFixedExpenseAPI(params),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['fixed-expense-info']});
            navigate('/fixedExpense/list');
        },
    });

    // 3. 발견된 고정지출 승인 mutation
    const approveDetectedFixedExpenseMutation = useMutation({
        mutationFn: (params: { id: number, data: FixedExpenseRequest }) =>
            approveDetectedFixedExpenseAPI(params),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['fixed-expense-info']});
            queryClient.invalidateQueries({queryKey: ['detected-fixed-expense-info']});
            navigate('/fixedExpense/list');
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        if (name === 'amount') {
            // 숫자만 허용
            const numberValue = value.replace(/[^0-9]/g, '');
            const amount = parseInt(numberValue) || 0;
            setFormData({...formData, amount});
        } else {
            setFormData({...formData, [name]: value});
        }
    };

    // 계좌 선택 핸들러
    const handleAccountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedAccountNumber = e.target.value;
        setFormData({...formData, accountNumber: selectedAccountNumber});
    };

    // 고정지출 등록 API 호출.
    const handleSubmit = () => {
        if (!formData.accountNumber) {
            alert('계좌를 선택해주세요.');
            return;
        }

        const today = new Date();
        const fixedExpenseData: FixedExpenseRequest = {
            accountNumber: formData.accountNumber,
            name: formData.name,
            money: {
                amount: formData.amount,
            },
            startDate: today.toISOString().split('T')[0], // 오늘 날짜, YYYY-MM-DD 형식
            payDay: formData.payDay,
            transactionCount: formData.transactionCount,
            memo: formData.memo || undefined,
        };
        console.log(fixedExpenseData);

        // 모드에 따라 다른 API 호출
        switch (mode) {
            case 'REGISTER':
                // 발견된 고정지출 등록 - 승인 API 호출
                if (formData.id) {
                    approveDetectedFixedExpenseMutation.mutate({
                        id: formData.id,
                        data: fixedExpenseData,
                    });
                } else {
                    createFixedExpenseMutation.mutate(fixedExpenseData); // 또는 ADD 모드로 처리
                }
                break;

            case 'MODIFY':
                // 고정지출 수정
                if (formData.id) {
                    updateFixedExpenseMutation.mutate({
                        id: formData.id,
                        data: fixedExpenseData,
                    });
                }
                break;

            case 'ADD':
                // 새 고정지출 추가
                createFixedExpenseMutation.mutate(fixedExpenseData);
                break;

            default:
                createFixedExpenseMutation.mutate(fixedExpenseData);
        }
    };

    const getActionText = () => {
        switch (mode) {
            case 'REGISTER':
                return '등록하기';
            case 'MODIFY':
                return '수정하기';
            case 'ADD':
                return '추가하기';
            default:
                return '등록하기';
        }
    };

    const isFormValid = formData.name.trim() !== '' && formData.amount > 0 && formData.accountNumber;
    const isLoading =
        createFixedExpenseMutation.isPending ||
        updateFixedExpenseMutation.isPending ||
        approveDetectedFixedExpenseMutation.isPending;

    return (
        <div className="flex h-full flex-col bg-gray-50">
            {/* 입력 폼 */}
            <div className="flex-1 bg-white p-4">
                <div className="mb-6">
                    <p className="mb-1 text-sm text-gray-600">고정지출명</p>
                    <BorderInput
                        type="text"
                        label="name"
                        placeholder="지출 명 입력"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-6">
                    <p className="mb-1 text-sm text-gray-600">금액</p>
                    <BorderInput
                        type="text"
                        label="amount"
                        placeholder="금액 입력"
                        value={formatCurrency(formData.amount)}
                        onChange={handleChange}
                        content={<span className="self-center font-medium text-gray-600">원</span>}
                    />
                </div>

                <div className="mb-6">
                    <p className="mb-1 text-sm text-gray-600">지출 계좌</p>
                    <div className="relative">
                        <select
                            name="accountNumber"
                            value={formData.accountNumber}
                            onChange={handleAccountChange}
                            className="w-full border-b border-gray-400 py-2.5 pl-2.5 font-medium text-gray-900 focus:outline-none"
                            disabled={isLoadingAccounts}
                        >
                            <option value="" disabled>
                                계좌를 선택해주세요
                            </option>
                            {accounts.map((account) => (
                                <option key={account.accountNumber} value={account.accountNumber}>
                                    {account.bankName} {account.accountName} ({account.accountNumber})
                                </option>
                            ))}
                        </select>
                        {isLoadingAccounts && <p className="text-sm text-gray-400">계좌 정보 로딩중...</p>}
                    </div>
                </div>

                <div className="mb-6">
                    <p className="mb-1 text-sm text-gray-600">지출 날짜</p>
                    <div className="relative">
                        <select
                            name="payDay"
                            value={formData.payDay}
                            onChange={(e) => setFormData({...formData, payDay: parseInt(e.target.value)})}
                            className="w-full border-b border-gray-400 py-2.5 pl-2.5 font-semibold text-gray-900 focus:outline-none"
                        >
                            {Array.from({length: 31}, (_, i) => i + 1).map((day) => (
                                <option key={day} value={day}>
                                    {day}일
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <p className="mb-1 text-sm text-gray-600">메모 (선택)</p>
                    <textarea
                        name="memo"
                        placeholder="내용을 입력해주세요."
                        value={formData.memo}
                        onChange={(e) => setFormData({...formData, memo: e.target.value})}
                        className="h-[120px] w-full resize-none rounded-lg border border-gray-300 p-3 font-medium text-gray-900 focus:border-gray-400 focus:outline-none"
                    />
                </div>
            </div>

            {/* 하단 버튼 */}
            <div className="bg-white p-4">
                <button
                    onClick={handleSubmit}
                    disabled={!isFormValid || isLoading}
                    className={`text-m w-full cursor-pointer rounded-lg p-4 font-medium ${
                        isFormValid && !isLoading
                            ? 'cursor-pointer bg-yellow-400 text-white hover:bg-yellow-500'
                            : 'cursor-not-allowed bg-gray-200 text-gray-400'
                    }`}
                >
                    {isLoading ? '처리 중...' : getActionText()}
                </button>
            </div>
        </div>
    );
};

export default FixedExpenseCreate;
