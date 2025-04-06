import { useState, useMemo } from 'react';
import { BANK_LIST } from '@/entities/certification/model/constants';
import { BankItem } from '@/entities/certification/ui/BankItem';

export const AccountConnectWidget = () => {
    const [selectedBanks, setSelectedBanks] = useState<string[]>([]);

    const handleSelectBank = (code: string) => {
        setSelectedBanks(prevSelected =>
            prevSelected.includes(code)
                ? prevSelected.filter(c => c !== code)
                : [...prevSelected, code]
        );
    };

    const allBankCodes = useMemo(() => BANK_LIST.map(bank => bank.code), []);
    const isAllSelected = useMemo(() => allBankCodes.length > 0 && selectedBanks.length === allBankCodes.length, [selectedBanks, allBankCodes]);

    const handleSelectAllToggle = () => {
        if (isAllSelected) {
            setSelectedBanks([]);
        } else {
            setSelectedBanks(allBankCodes);
        }
    };

    const selectedCount = selectedBanks.length;

    const tabs = [
        { id: 'bank', name: '은행' },
        { id: 'card', name: '카드' },
        { id: 'stock', name: '증권' },
        { id: 'point', name: '포인트' },
        { id: 'insurance', name: '보험' },
        { id: 'savings', name: '저축' },
    ];
    const [activeTab, setActiveTab] = useState('bank');

    return (
        <div className="flex flex-col h-full flex-1 p-6">
            <h1 className="text-2xl font-bold mb-6">어떤 자산을 연결할까요?</h1>

            <div className="flex border-b border-gray-200">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`flex-1 py-3 text-center text-sm font-medium cursor-pointer ${ 
                            activeTab === tab.id 
                                ? 'border-b-2 border-yellow-600 text-yellow-600' 
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.name}{tab.id === 'bank' && selectedCount > 0 ? ` ${selectedCount}` : ''}
                    </button>
                ))}
            </div>

            <div className="flex-grow overflow-y-auto p-4">
                {activeTab === 'bank' && (
                    <div className="flex flex-col gap-4 overflow-hidden">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-base font-semibold">은행</h2>
                            <button
                                className="text-xs text-yellow-600 hover:text-yellow-800 font-medium cursor-pointer"
                                onClick={handleSelectAllToggle}
                            >
                                {isAllSelected ? '전체 해제' : '전체 선택'}
                            </button>
                        </div>
                        <div className="flex flex-col gap-2">
                            {BANK_LIST.map(bank => (
                                <BankItem
                                    key={bank.code}
                                    bank={bank}
                                    isSelected={selectedBanks.includes(bank.code)}
                                    onSelect={handleSelectBank}
                                />
                            ))}
                        </div>
                    </div>
                )}
                {activeTab !== 'bank' && (
                    <div className="text-center text-gray-500 mt-10"> 
                        {tabs.find(t => t.id === activeTab)?.name} 기능은 준비중입니다.
                    </div>
                )}
            </div>

            <button
                className={`w-full rounded-xl py-4 font-bold text-lg text-white ${ 
                    selectedCount > 0
                        ? "bg-brand-primary-500 text-white hover:bg-brand-primary-400"
                        : "bg-gray-200 text-gray-500"
                }`}
                disabled={selectedCount === 0}
            >
                {selectedCount > 0 ? `${selectedCount}개 연결하기` : '연결할 자산을 선택해주세요'}
            </button>
        </div>
    );
};

export default AccountConnectWidget;
