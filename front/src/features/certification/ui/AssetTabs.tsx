import { useState } from 'react';
import type { Tab } from '../model/types';

interface AssetTabsProps {
    tabs: Tab[];
    initialTabId: string;
    selectedBankCount?: number; // Optional prop for bank count
    onTabChange: (tabId: string) => void;
}

export const AssetTabs = ({ tabs, initialTabId, selectedBankCount, onTabChange }: AssetTabsProps) => {
    const [activeTab, setActiveTab] = useState(initialTabId);

    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);
        onTabChange(tabId);
    };

    return (
        <div className="flex border-b border-gray-200">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    className={`flex-1 py-3 text-center text-sm font-medium cursor-pointer ${ 
                        activeTab === tab.id 
                            ? 'border-b-2 border-yellow-600 text-yellow-600' 
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => handleTabClick(tab.id)}
                >
                    {tab.name}
                    {tab.id === 'bank' && selectedBankCount && selectedBankCount > 0 ? ` ${selectedBankCount}` : ''}
                </button>
            ))}
        </div>
    );
}; 