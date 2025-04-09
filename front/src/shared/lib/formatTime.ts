// 시간 포맷팅 헬퍼 함수
const formatTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    // 유효한 날짜인지 확인
    if (isNaN(date.getTime())) {
      // 유효하지 않은 날짜 문자열이면 빈 문자열 반환 또는 다른 처리
      // throw new Error('Invalid date string'); 
      console.warn("Invalid date string for time formatting:", dateString);
      return ""; 
    }
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch (e) {
    // 에러 로깅은 유지하되, 사용자에게는 빈 문자열 반환
    console.error("Error formatting time:", dateString, e);
    return ""; 
  }
};

export default formatTime; 