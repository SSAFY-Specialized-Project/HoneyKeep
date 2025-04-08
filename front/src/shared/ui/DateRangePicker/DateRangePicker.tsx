import { useState } from 'react';
import { Icon } from '@/shared/ui';

// 날짜 관련 타입 정의
interface CalendarDate {
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
}

interface DateRangePickerProps {
  onApply: (startDate: Date | null, endDate: Date | null) => void;
  onCancel?: () => void;
  initialStartDate?: Date | null;
  initialEndDate?: Date | null;
}

const DateRangePicker = ({
  onApply,
  onCancel,
  initialStartDate = null,
  initialEndDate = null,
}: DateRangePickerProps) => {
  // 현재 날짜 가져오기
  const today = new Date();

  // 상태 관리
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate);
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate);
  const [selectingStartDate, setSelectingStartDate] = useState<boolean>(true);

  // 요일 표시
  const weekdays: string[] = ['일', '월', '화', '수', '목', '금', '토'];

  // 날짜 계산 함수
  const getDaysInMonth = (year: number, month: number): number =>
    new Date(year, month + 1, 0).getDate();

  const getFirstDayOfMonth = (year: number, month: number): number =>
    new Date(year, month, 1).getDay();

  // 이전달과 다음달의 날짜 계산
  const generateCalendarDays = (): CalendarDate[] => {
    const daysInMonth: number = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfMonth: number = getFirstDayOfMonth(currentYear, currentMonth);

    // 이전 달의 마지막 날짜들
    const prevMonthDays: CalendarDate[] = [];
    if (firstDayOfMonth > 0) {
      const daysInPrevMonth: number = getDaysInMonth(
        currentMonth === 0 ? currentYear - 1 : currentYear,
        currentMonth === 0 ? 11 : currentMonth - 1,
      );

      for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        prevMonthDays.push({
          day: daysInPrevMonth - i,
          month: currentMonth === 0 ? 11 : currentMonth - 1,
          year: currentMonth === 0 ? currentYear - 1 : currentYear,
          isCurrentMonth: false,
        });
      }
    }

    // 현재 달의 날짜들
    const currentMonthDays: CalendarDate[] = [];
    for (let i = 1; i <= daysInMonth; i++) {
      currentMonthDays.push({
        day: i,
        month: currentMonth,
        year: currentYear,
        isCurrentMonth: true,
      });
    }

    // 다음 달의 첫 날짜들
    const nextMonthDays: CalendarDate[] = [];
    const totalDaysDisplayed: number =
      (prevMonthDays?.length || 0) + (currentMonthDays?.length || 0);
    const remainingCells: number = 42 - totalDaysDisplayed; // 6주(42일) 표시

    for (let i = 1; i <= remainingCells; i++) {
      nextMonthDays.push({
        day: i,
        month: currentMonth === 11 ? 0 : currentMonth + 1,
        year: currentMonth === 11 ? currentYear + 1 : currentYear,
        isCurrentMonth: false,
      });
    }

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  // 이전 달로 이동
  const goToPrevMonth = (): void => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // 다음 달로 이동
  const goToNextMonth = (): void => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // 날짜 포맷팅 함수
  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // 두 날짜 비교 함수
  const isSameDate = (date1: Date | null, date2: Date | null): boolean => {
    if (!date1 || !date2) return false;
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // 날짜가 범위 안에 있는지 확인하는 함수
  const isInRange = (date: CalendarDate): boolean => {
    if (!startDate || !endDate) return false;
    const currentDate = new Date(date.year, date.month, date.day);
    return currentDate > startDate && currentDate < endDate;
  };

  // 날짜 선택 핸들러
  const handleDateClick = (date: CalendarDate): void => {
    const selectedDate = new Date(date.year, date.month, date.day);

    if (selectingStartDate) {
      setStartDate(selectedDate);
      setEndDate(null);
      setSelectingStartDate(false);
    } else {
      // 시작일보다 이전 날짜를 선택한 경우
      if (startDate && selectedDate < startDate) {
        setStartDate(selectedDate);
        setEndDate(null);
      } else {
        setEndDate(selectedDate);
        setSelectingStartDate(true);
      }
    }
  };

  // 확인 버튼 핸들러
  const handleApply = (): void => {
    onApply(startDate, endDate);
  };

  // 취소 버튼 핸들러
  const handleCancel = (): void => {
    if (onCancel) onCancel();
  };

  // 전체 날짜 배열
  const calendarDays: CalendarDate[] = generateCalendarDays();

  // 날짜를 클래스로 스타일링
  const getDateClasses = (date: CalendarDate): string => {
    let classes: string = 'w-full h-10 flex items-center justify-center cursor-pointer relative';

    // 현재 달이 아닌 경우 연한 회색
    if (!date.isCurrentMonth) {
      classes += ' text-gray-300';
    } else {
      // 일요일은 빨간색
      if (new Date(date.year, date.month, date.day).getDay() === 0) {
        classes += ' text-red-400';
      }
      // 토요일은 파란색/보라색
      else if (new Date(date.year, date.month, date.day).getDay() === 6) {
        classes += ' text-indigo-600';
      }
    }

    const currentDate = new Date(date.year, date.month, date.day);

    // 시작일 강조
    if (startDate && isSameDate(currentDate, startDate)) {
      classes += ' bg-blue-500 text-white rounded-l';
    }

    // 종료일 강조
    if (endDate && isSameDate(currentDate, endDate)) {
      classes += ' bg-blue-500 text-white rounded-r';
    }

    // 범위 내 날짜 강조
    if (isInRange(date)) {
      classes += ' bg-blue-100';
    }

    return classes;
  };

  // 요일 스타일링
  const getWeekdayClass = (index: number): string => {
    if (index === 0) return 'text-red-400'; // 일요일
    if (index === 6) return 'text-indigo-600'; // 토요일
    return 'text-gray-800'; // 평일
  };

  return (
    <div className="w-72 rounded-lg bg-white p-4 shadow-lg">
      {/* 헤더: 연도, 월 & 네비게이션 */}
      <div className="mb-4 flex items-center justify-between px-2">
        <button onClick={goToPrevMonth} className="flex cursor-pointer items-center justify-center">
          <Icon id="chevron-left" size="small" />
        </button>
        <h2 className="text-center text-lg font-medium">
          {currentYear}년 {currentMonth + 1}월
        </h2>
        <button onClick={goToNextMonth} className="flex cursor-pointer items-center justify-center">
          <Icon id="chevron-right" size="small" />
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="mb-2 grid grid-cols-7">
        {weekdays.map((day, index) => (
          <div
            key={index}
            className={`py-1 text-center text-sm font-normal ${getWeekdayClass(index)}`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 달력 날짜 그리드 */}
      <div className="grid grid-cols-7">
        {calendarDays.map((date, index) => (
          <div key={index} className={getDateClasses(date)} onClick={() => handleDateClick(date)}>
            {date.day}
          </div>
        ))}
      </div>

      {/* 날짜 표시 영역 */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm">
          <div className="mb-1 text-gray-600">시작일:</div>
          <div className="font-medium">{formatDate(startDate)}</div>
        </div>
        <div className="mx-2">~</div>
        <div className="text-sm">
          <div className="mb-1 text-gray-600">종료일:</div>
          <div className="font-medium">{formatDate(endDate)}</div>
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="mt-4 flex justify-end space-x-2">
        <button
          onClick={handleCancel}
          className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100"
        >
          취소
        </button>
        <button
          onClick={handleApply}
          className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
          disabled={!startDate || !endDate}
        >
          적용
        </button>
      </div>
    </div>
  );
};

export default DateRangePicker;
