import React, {useState} from "react";
import {BorderInput} from "@/shared/ui";
import {useNavigate, useLocation} from "react-router-dom";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {
    createFixedExpenseAPI,
    updateFixedExpenseAPI,
    approveDetectedFixedExpenseAPI
} from "@/entities/fixedExpense/api";
import {FixedExpenseRequest} from "@/entities/fixedExpense/model/types";

type Mode = "REGISTER" | "MODIFY" | "ADD";

interface FixedExpenseCreateProps {
    mode?: Mode;
    initialData?: {
        id?: number;
        name: string;
        amount: number;
        payDay: number;
        memo: string;
        accountNumber: string;
    };
}

const FixedExpenseCreate = ({mode: propMode, initialData: propInitialData}: FixedExpenseCreateProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();

    // location.state에서 mode와 initialData를 받아옴 (있는 경우에만)
    const stateMode = location.state?.mode;
    const stateInitialData = location.state?.initialData;

    // props로 받은 값과 state로 받은 값 중에서 우선순위 결정 (state > props > default)
    const mode = stateMode || propMode || "REGISTER";
    const initialData = stateInitialData || propInitialData;

    const [formData, setFormData] = useState({
        id: initialData?.id,
        name: initialData?.name || "",
        amount: initialData?.amount || 0,
        payDay: initialData?.payDay,
        memo: initialData?.memo || "",
        accountNumber: initialData.accountNumber,
    });

    console.log(formData);

    // 1. 고정지출 생성 mutation
    const createFixedExpenseMutation = useMutation({
        mutationFn: (data: FixedExpenseRequest) => createFixedExpenseAPI(data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['fixed-expense-info']});
            navigate('/fixedExpense/list');
        }
    });

    // 2. 고정지출 수정 mutation
    const updateFixedExpenseMutation = useMutation({
        mutationFn: (params: { id: number; data: FixedExpenseRequest }) => updateFixedExpenseAPI(params),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['fixed-expense-info']});
            navigate('/fixedExpense/list');
        }
    });

    // 3. 발견된 고정지출 승인 mutation
    const approveDetectedFixedExpenseMutation = useMutation({
        mutationFn: (id: number) => approveDetectedFixedExpenseAPI(id),
        onSuccess: () => {
            // 승인 후 바로 고정지출 생성 API 호출
            const today = new Date();
            const fixedExpenseData: FixedExpenseRequest = {
                accountNumber: formData.accountNumber,
                name: formData.name,
                money: {
                    amount: formData.amount
                },
                startDate: today.toISOString().split('T')[0], // 오늘 날짜, YYYY-MM-DD 형식
                payDay: formData.payDay,
                memo: formData.memo || undefined
            };

            createFixedExpenseMutation.mutate(fixedExpenseData);
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        if (name === "amount") {
            // 숫자만 허용
            const numberValue = value.replace(/[^0-9]/g, "");
            setFormData({...formData, [name]: parseInt(numberValue) || 0});
        } else {
            setFormData({...formData, [name]: value});
        }
    };

    const handleSubmit = () => {
        // 폼 데이터를 API 요청 형식으로 변환
        const today = new Date();
        const fixedExpenseData: FixedExpenseRequest = {
            accountNumber: formData.accountNumber,
            name: formData.name,
            money: {
                amount: formData.amount
            },
            startDate: today.toISOString().split('T')[0], // 오늘 날짜, YYYY-MM-DD 형식
            payDay: formData.payDay,
            memo: formData.memo || undefined
        };
        console.log(fixedExpenseData);

        // 모드에 따라 다른 API 호출
        switch (mode) {
            case "REGISTER":
                // 발견된 고정지출 등록 - 두 API 순차 호출
                if (formData.id) {
                    approveDetectedFixedExpenseMutation.mutate(formData.id);
                } else {
                    // ID가 없으면 바로 생성 API 호출
                    createFixedExpenseMutation.mutate(fixedExpenseData);
                }
                break;

            case "MODIFY":
                // 고정지출 수정
                if (formData.id) {
                    updateFixedExpenseMutation.mutate({
                        id: formData.id,
                        data: fixedExpenseData
                    });
                }
                break;

            case "ADD":
                // 새 고정지출 추가
                createFixedExpenseMutation.mutate(fixedExpenseData);
                break;

            default:
                createFixedExpenseMutation.mutate(fixedExpenseData);
        }
    };

    const getActionText = () => {
        switch (mode) {
            case "REGISTER":
                return "등록하기";
            case "MODIFY":
                return "수정하기";
            case "ADD":
                return "추가하기";
            default:
                return "등록하기";
        }
    };

    const isFormValid = formData.name.trim() !== "" && formData.amount > 0;
    const isLoading =
        createFixedExpenseMutation.isPending ||
        updateFixedExpenseMutation.isPending ||
        approveDetectedFixedExpenseMutation.isPending;

    return (
        <div className="flex flex-col h-full bg-gray-50">

            {/* 입력 폼 */}
            <div className="flex-1 p-4 bg-white">
                <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-1">고정지출명</p>
                    <BorderInput
                        type="text"
                        label="name"
                        placeholder="지출 명 입력"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-1">금액</p>
                    <BorderInput
                        type="text"
                        label="amount"
                        placeholder="금액 입력"
                        value={formData.amount.toLocaleString()}
                        onChange={handleChange}
                        content={<span className="self-center font-medium text-gray-600">원</span>}
                    />
                </div>

                <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-1">지출 날짜</p>
                    <div className="relative">
                        <select
                            name="payDay"
                            value={formData.payDay}
                            onChange={(e) => setFormData({...formData, payDay: parseInt(e.target.value)})}
                            className="w-full border-b border-gray-400 py-2.5 pl-2.5 font-semibold text-gray-900 focus:outline-none"
                        >
                            {Array.from({length: 31}, (_, i) => i + 1).map(day => (
                                <option key={day} value={day}>{day}일</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <p className="text-sm text-gray-600 mb-1">메모 (선택)</p>
                    <textarea
                        name="memo"
                        placeholder="내용을 입력해주세요."
                        value={formData.memo}
                        onChange={(e) => setFormData({...formData, memo: e.target.value})}
                        className="w-full h-[120px] border border-gray-300 rounded-lg p-3 text-gray-900 font-medium resize-none focus:outline-none focus:border-gray-400"
                    />
                </div>
            </div>

            {/* 하단 버튼 */}
            <div className="p-4 bg-white">
                <button
                    onClick={handleSubmit}
                    disabled={!isFormValid || isLoading}
                    className={`w-full p-4 rounded-lg text-m font-medium ${
                        isFormValid && !isLoading
                            ? 'bg-yellow-400 hover:bg-yellow-500 text-white cursor-pointer'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    {isLoading ? "처리 중..." : getActionText()}
                </button>
            </div>
        </div>
    );
};

// // payDay를 Date 객체로 변환하는 함수 수정
// const getPayDayDate = (day: number) => {
//     const date = new Date();
//     // 일자가 현재 월의 마지막 날짜보다 크면 마지막 날짜로 조정
//     const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
//     date.setDate(Math.min(day, lastDayOfMonth));
//     return date;
// };

export default FixedExpenseCreate;
