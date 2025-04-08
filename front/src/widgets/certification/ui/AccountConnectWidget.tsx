import {useState} from 'react';
import {AssetTabs} from '@/features/certification/ui/AssetTabs';
import {SelectBanks} from '@/features/certification/ui/SelectBanks';
import {ConnectAssetsButton} from '@/features/certification/ui/ConnectAssetsButton';
import {
    BankConnectForMydataRequest,
    ConnectedAccountResponse,
    Tab
} from '@/features/certification/model/types';
import {useMutation} from "@tanstack/react-query";
import {ResponseDTO, ResponseErrorDTO} from "@/shared/model/types.ts";
import {mydataConnectAPI} from "@/features/certification/api";
import {useNavigate} from "react-router";

// Define tabs data within the widget or import from a shared location
const tabsData: Tab[] = [
    {id: 'bank', name: '은행'},
    {id: 'card', name: '카드'},
    {id: 'stock', name: '증권'},
    {id: 'point', name: '포인트'},
    {id: 'insurance', name: '보험'},
    {id: 'savings', name: '저축'},
];

export const AccountConnectWidget = () => {
    const [selectedBanks, setSelectedBanks] = useState<string[]>([]);
    const [activeTabId, setActiveTabId] = useState<string>(tabsData[0].id); // Initialize with the first tab
    const navigate = useNavigate();

    const mydataConnectMutation = useMutation<
        ResponseDTO<ConnectedAccountResponse[]>,
        ResponseErrorDTO | Error,
        BankConnectForMydataRequest
    >({
        mutationFn: mydataConnectAPI,
        onSuccess: (response) => {
            if (response?.status === 200) {
                console.log("마이데이터 연동 성공", response);
                navigate('/success', {
                    state: {
                        title: "마이데이터 연동 성공",
                        description: "마이데이터 연동이 성공적으로 완료되었습니다.",
                        buttonText: "홈으로",

                    }
                });
            }
        },
        onError: (error) => {
            if (error instanceof Error && 'status' in error && typeof error.status === 'number' && 'message' in error) {
                if (error.status === 400) {
                    console.error(`API 요청 실패 (상태 코드 400): ${error.message}`, error);
                } else if (error.status === 401) {
                    console.error(`인증 실패 (상태 코드 401): ${error.message}`, error);
                    alert("로그인이 필요합니다. 다시 로그인 해주세요.");
                } else {
                    console.error(`API 오류 (상태 코드 ${error.status}): ${error.message}`, error);
                    alert("요청 처리 중 오류가 발생했습니다.");
                }
            } else {
                console.error('마이데이터 연동 중 알 수 없는 에러 발생:', error);
                alert("알 수 없는 오류가 발생했습니다. 네트워크 상태를 확인하거나 잠시 후 다시 시도해주세요.");
            }
        },
    });

    const handleConnect = () => {
        // TODO: 은행 연결 API 호출하기 .
        mydataConnectMutation.mutate({bankCodes: selectedBanks});
    };

    const selectedCount = selectedBanks.length;

    return (
        <div className="flex flex-col h-full flex-1 p-6">
            <h1 className="text-2xl font-bold mb-6">어떤 자산을 연결할까요?</h1>

            {/*탭 선택*/}
            <AssetTabs
                tabs={tabsData}
                initialTabId={activeTabId}
                selectedBankCount={activeTabId === 'bank' ? selectedCount : undefined}
                onTabChange={setActiveTabId}
            />

            {/* 탭 선택시 내용 */}
            <div className="flex-grow overflow-y-auto p-4">
                {activeTabId === 'bank' && (
                    <SelectBanks
                        selectedBanks={selectedBanks}
                        onSelectionChange={setSelectedBanks}
                    />
                )}
                {activeTabId !== 'bank' && (
                    <div className="text-center text-gray-500 mt-10">
                        {tabsData.find(t => t.id === activeTabId)?.name} 기능은 준비중입니다.
                    </div>
                )}
            </div>

            {/* 연결하기 버튼 */}
            <ConnectAssetsButton
                selectedCount={selectedCount}
                onClick={handleConnect}
            />
        </div>
    );
};

export default AccountConnectWidget;
