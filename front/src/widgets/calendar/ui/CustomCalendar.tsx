import React, { useState } from 'react';

// 날짜 관련 타입 정의
interface CalendarDate {
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
}

const CustomCalendar: React.FC = () => {
  // 이미지에서 보이는 2025년 2월 달력 설정
  const [currentMonth, setCurrentMonth] = useState<number>(1); // 0부터 시작하므로 1은 2월
  const [currentYear, setCurrentYear] = useState<number>(2025);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2025, 1, 21));

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
    const totalDaysDisplayed: number = prevMonthDays.length + currentMonthDays.length;
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

  // 날짜 선택 핸들러
  const handleDateClick = (date: CalendarDate): void => {
    setSelectedDate(new Date(date.year, date.month, date.day));
  };

  // 날짜를 클래스로 스타일링
  const getDateClasses = (date: CalendarDate): string => {
    let classes: string = 'w-full h-12 flex items-center justify-center cursor-pointer';

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

    // 선택된 날짜가 2월 21일
    if (date.day === 21 && date.month === 1 && date.year === 2025) {
      classes += ' text-red-500 font-medium';
    }

    return classes;
  };

  // 요일 스타일링
  const getWeekdayClass = (index: number): string => {
    if (index === 0) return 'text-red-400'; // 일요일
    if (index === 6) return 'text-indigo-600'; // 토요일
    return 'text-gray-800'; // 평일
  };

  const calendarDays: CalendarDate[] = generateCalendarDays();

  return (
    <div className="mx-auto max-w-md font-sans">
      {/* 헤더: 연도, 월 & 네비게이션 */}
      <div className="mb-4 flex items-center justify-between px-4">
        <button onClick={goToPrevMonth} className="text-2xl font-medium text-gray-600">
          {'<'}
        </button>
        <h2 className="text-center text-2xl font-medium">
          {currentYear} {currentMonth + 1}월
        </h2>
        <button onClick={goToNextMonth} className="text-2xl font-medium text-gray-600">
          {'>'}
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="mb-2 grid grid-cols-7">
        {weekdays.map((day, index) => (
          <div key={index} className={`py-2 text-center font-normal ${getWeekdayClass(index)}`}>
            {day}
          </div>
        ))}
      </div>

      {/* 달력 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-y-2">
        {calendarDays.map((date, index) => (
          <div key={index} className={getDateClasses(date)} onClick={() => handleDateClick(date)}>
            {date.day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomCalendar;
