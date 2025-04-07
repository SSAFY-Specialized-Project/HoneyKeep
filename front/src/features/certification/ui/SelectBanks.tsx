import { useMemo } from 'react'; // Removed useState as state is managed by parent
import { BANK_LIST } from '@/entities/certification/model/constants';
import { BankItem } from '@/entities/certification/ui/BankItem';

interface SelectBanksProps {
    selectedBanks: string[];
    onSelectionChange: (selectedBanks: string[]) => void;
}

export const SelectBanks = ({ selectedBanks, onSelectionChange }: SelectBanksProps) => {

    const handleSelectBank = (code: string) => {
        const newSelection = selectedBanks.includes(code)
            ? selectedBanks.filter(c => c !== code)
            : [...selectedBanks, code];
        onSelectionChange(newSelection);
    };

    const allBankCodes = useMemo(() => BANK_LIST.map(bank => bank.code), []);
    const isAllSelected = useMemo(() => allBankCodes.length > 0 && selectedBanks.length === allBankCodes.length, [selectedBanks, allBankCodes]);

    const handleSelectAllToggle = () => {
        if (isAllSelected) {
            onSelectionChange([]);
        } else {
            onSelectionChange(allBankCodes);
        }
    };

    return (
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
    );
}; 