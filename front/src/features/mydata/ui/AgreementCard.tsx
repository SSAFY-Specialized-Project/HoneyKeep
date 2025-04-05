import {useState} from 'react';
import {AgreementSection} from '../model/constants.ts';

interface Props {
    section: AgreementSection;
    checked: boolean;
    onToggle: () => void;
}

const AgreementCard = ({section, checked, onToggle}: Props) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mb-3 border border-gray-100 rounded-lg shadow-sm">
            <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                            e.stopPropagation();
                            onToggle();
                        }}
                        className="w-5 h-5 mr-3 accent-brand-primary-500"
                    />
                    <h3 className="font-semibold text-md">{section.title}</h3>
                </div>
                <div>
                    {isOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"
                             fill="currentColor">
                            <path fillRule="evenodd"
                                  d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                  clipRule="evenodd"/>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"
                             fill="currentColor">
                            <path fillRule="evenodd"
                                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                  clipRule="evenodd"/>
                        </svg>
                    )}
                </div>
            </div>

            {isOpen && (
                <div className="p-4 border-t border-gray-100 bg-gray-50">
                    <ul className="list-disc ml-5 space-y-2">
                        {section.items.map((item, index) => (
                            <li key={index} className="text-sm text-gray-700">{item}</li>
                        ))}
                    </ul>
                    {section.note && (
                        <p className="text-xs text-gray-600 mt-2">
                            {section.note}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default AgreementCard; 