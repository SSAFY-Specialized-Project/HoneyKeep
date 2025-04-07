import { Pocket } from '@/entities/pocket/model/types';
import { Icon } from '@/shared/ui';
import { useEffect, useState } from 'react';

// 날짜 관련 타입 정의
interface CalendarDate {
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  indicators?: IndicatorType[]; // 표시할 동그라미 종류 배열
}

// 인디케이터 타입 (동그라미 색상 종류)
type IndicatorType = 'gray' | 'yellow' | 'green';

// 날짜별 인디케이터 데이터
interface DateIndicatorData {
  year: number;
  month: number;
  day: number;
  indicators: IndicatorType[];
  products?: Pocket[]; // 해당 날짜에 표시될 제품 데이터
}

interface CustomCalendarProps {
  products?: Pocket[];
  onDateSelect?: (date: Date, products: Pocket[]) => void;
}

const CustomCalendar = ({ products = [], onDateSelect }: CustomCalendarProps) => {
  // 현재 날짜 가져오기
  const today = new Date();

  // 현재 월과 연도로 초기화
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [selectedProducts, setSelectedProducts] = useState<Pocket[]>([]);

  // 제품 데이터에서 날짜별 인디케이터 데이터 생성
  const generateIndicatorData = () => {
    const dateMap: Record<string, DateIndicatorData> = {};

    products.forEach((product) => {
      const endDate = new Date(product.endDate);
      const year = endDate.getFullYear();
      const month = endDate.getMonth();
      const day = endDate.getDate();

      const dateKey = `${year}-${month}-${day}`;

      if (!dateMap[dateKey]) {
        dateMap[dateKey] = {
          year,
          month,
          day,
          indicators: [],
          products: [],
        };
      }

      // 제품 타입에 따라 다른 인디케이터 색상 지정
      let indicatorType: IndicatorType;
      switch (product.type) {
        case 'UNUSED':
          indicatorType = 'gray';
          break;
        case 'USING':
          indicatorType = 'yellow';
          break;
        case 'USED':
          indicatorType = 'green';
          break;
        default:
          indicatorType = 'gray';
      }

      // 중복 인디케이터 방지
      if (!dateMap[dateKey].indicators.includes(indicatorType)) {
        dateMap[dateKey].indicators.push(indicatorType);
      }

      // 제품 데이터 추가
      dateMap[dateKey].products = [...(dateMap[dateKey].products || []), product];
    });

    return Object.values(dateMap);
  };

  // 제품 데이터를 기반으로 인디케이터 데이터 생성
  const [indicatorData, setIndicatorData] = useState<DateIndicatorData[]>([]);

  // 요일 표시
  const weekdays: string[] = ['일', '월', '화', '수', '목', '금', '토'];

  // 날짜 계산 함수
  const getDaysInMonth = (year: number, month: number): number =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number): number =>
    new Date(year, month, 1).getDay();

  // 날짜에 인디케이터 추가하는 함수
  const addIndicatorsToDate = (dates: CalendarDate[]): CalendarDate[] => {
    return dates.map((date) => {
      const matchingData = indicatorData.find(
        (data) => data.year === date.year && data.month === date.month && data.day === date.day,
      );

      if (matchingData) {
        return { ...date, indicators: matchingData.indicators };
      }

      return date;
    });
  };

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

    const allDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
    // 인디케이터 추가
    return addIndicatorsToDate(allDays);
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

  // 제품 데이터가 변경되면 인디케이터 데이터 업데이트
  useEffect(() => {
    if (products.length > 0) {
      setIndicatorData(generateIndicatorData());
    }
  }, [products]);

  // 선택된 날짜 변경 시 해당 날짜의 제품 목록 업데이트
  useEffect(() => {
    const selectedDateData = indicatorData.find(
      (data) =>
        data.year === selectedDate.getFullYear() &&
        data.month === selectedDate.getMonth() &&
        data.day === selectedDate.getDate(),
    );

    if (selectedDateData?.products) {
      setSelectedProducts(selectedDateData.products);

      // 부모 컴포넌트에 선택된 날짜와 제품 목록 전달
      if (onDateSelect) {
        onDateSelect(selectedDate, selectedDateData.products);
      }
    } else {
      setSelectedProducts([]);

      // 제품이 없는 경우에도 부모 컴포넌트에 알림
      if (onDateSelect) {
        onDateSelect(selectedDate, []);
      }
    }
  }, [selectedDate, indicatorData, onDateSelect]);

  // 날짜를 클래스로 스타일링
  const getDateClasses = (date: CalendarDate): string => {
    let classes: string = 'w-full h-12 flex flex-col items-center cursor-pointer relative';

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

    // 오늘 날짜 강조
    const todayDate = new Date();
    if (
      date.day === todayDate.getDate() &&
      date.month === todayDate.getMonth() &&
      date.year === todayDate.getFullYear()
    ) {
      classes += ' bg-blue-50 rounded';
    }

    // 선택된 날짜 강조
    if (
      date.day === selectedDate.getDate() &&
      date.month === selectedDate.getMonth() &&
      date.year === selectedDate.getFullYear()
    ) {
      classes += ' border-2 border-blue-500 rounded';
    }

    return classes;
  };

  // 인디케이터 색상 클래스 가져오기
  const getIndicatorClass = (type: IndicatorType): string => {
    switch (type) {
      case 'gray':
        return 'bg-gray-400';
      case 'yellow':
        return 'bg-yellow-400';
      case 'green':
        return 'bg-green-400';
      default:
        return 'bg-gray-400';
    }
  };

  // 요일 스타일링
  const getWeekdayClass = (index: number): string => {
    if (index === 0) return 'text-red-400'; // 일요일
    if (index === 6) return 'text-indigo-600'; // 토요일
    return 'text-gray-800'; // 평일
  };

  const calendarDays: CalendarDate[] = generateCalendarDays();

  return (
    <div className="w-full">
      {/* 헤더: 연도, 월 & 네비게이션 */}
      <div className="mb-4 flex items-center justify-center gap-4 px-4">
        <button onClick={goToPrevMonth} className="flex cursor-pointer items-center justify-center">
          <Icon id="chevron-left" size="small" />
        </button>
        <h2 className="text-center text-2xl font-medium">
          {currentYear} {currentMonth + 1}월
        </h2>
        <button onClick={goToNextMonth} className="flex cursor-pointer items-center justify-center">
          <Icon id="chevron-right" size="small" />
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
            {/* 날짜 숫자는 항상 동일한 위치에 (패딩 통일) */}
            <div className="pt-2">{date.day}</div>

            {/* 인디케이터 표시 - 항상 같은 공간 차지 */}
            <div className="mt-1 flex h-2 gap-1">
              {date.indicators &&
                date.indicators.length > 0 &&
                date.indicators.map((indicator, i) => (
                  <div
                    key={i}
                    className={`h-2 w-2 rounded-full ${getIndicatorClass(indicator)}`}
                  ></div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* 선택된 날짜의 제품 목록 */}
      {selectedProducts.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <h3 className="mb-2 text-lg font-medium">
            {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}
            일 제품 목록
          </h3>
          <div className="space-y-2">
            {selectedProducts.map((product) => (
              <div key={product.id} className="rounded border bg-gray-50 p-3">
                <div className="font-medium">{product.name}</div>
                <div className="text-sm text-gray-600">{product.accountName}</div>
                <div className="mt-2 flex justify-between text-sm">
                  <span>금액: {product.totalAmount.toLocaleString()}원</span>
                  <span>저축: {product.savedAmount.toLocaleString()}원</span>
                  <span
                    className={`font-medium ${
                      product.type === 'USED'
                        ? 'text-green-600'
                        : product.type === 'USING'
                          ? 'text-yellow-600'
                          : 'text-gray-600'
                    }`}
                  >
                    {product.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomCalendar;
