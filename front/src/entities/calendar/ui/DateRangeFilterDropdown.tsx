import { useState, useRef, useEffect } from 'react';
import { DateRangePicker, Icon } from '@/shared/ui';

interface DateRangeFilterDropdownProps {
  onApply: (startDate: Date | null, endDate: Date | null) => void;
  initialStartDate?: Date | null;
  initialEndDate?: Date | null;
  label?: string;
}

const DateRangeFilterDropdown = ({
  onApply,
  initialStartDate = null,
  initialEndDate = null,
  label = '날짜 범위',
}: DateRangeFilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate);
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 날짜 포맷팅 함수
  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // 드롭다운 토글
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // 날짜 선택 후 적용
  const handleApply = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
    setIsOpen(false);
    onApply(start, end);
  };

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 날짜 범위 표시 텍스트
  const getDisplayText = (): string => {
    if (startDate && endDate) {
      return `${formatDate(startDate)} ~ ${formatDate(endDate)}`;
    }
    return label;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 드롭다운 버튼 */}
      <button
        onClick={toggleDropdown}
        className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-2 shadow-sm hover:bg-gray-50"
      >
        <div className="flex items-center">
          <Icon id="calendar" size="small" />
          <span className="text-sm">{getDisplayText()}</span>
        </div>
        <Icon id={isOpen ? 'chevron-up' : 'chevron-down'} size="small" />
      </button>

      {/* 드롭다운 내용 */}
      {isOpen && (
        <div className="absolute z-10 mt-1">
          <DateRangePicker
            onApply={handleApply}
            onCancel={() => setIsOpen(false)}
            initialStartDate={startDate}
            initialEndDate={endDate}
          />
        </div>
      )}
    </div>
  );
};

export default DateRangeFilterDropdown;
