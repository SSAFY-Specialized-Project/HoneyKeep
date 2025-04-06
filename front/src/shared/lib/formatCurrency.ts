/**
 * 금액을 포맷팅하는 유틸리티 함수
 * - 소수점을 제거하고 천 단위 구분 기호를 추가합니다.
 */

/**
 * 숫자를 정수로 변환하고 천 단위 구분 기호를 추가합니다.
 * @param value 포맷팅할 숫자 또는 숫자 문자열
 * @returns 포맷팅된 문자열 (예: "91,953")
 */
export const formatCurrency = (
  value: number | string | null | undefined
): string => {
  // null, undefined 체크
  if (value === null || value === undefined) return "0";

  // 문자열인 경우 콤마 제거 후 숫자로 변환
  const numValue = typeof value === "string" 
    ? parseFloat(value.replace(/[^\d.-]/g, "")) 
    : value;

  // NaN 체크
  if (isNaN(numValue)) return "0";

  // 정수로 변환 후 천 단위 구분 기호 추가
  return Math.floor(numValue).toLocaleString();
};

/**
 * 숫자를 정수로 변환합니다. (소수점 제거)
 * @param value 정수로 변환할 숫자 또는 숫자 문자열
 * @returns 정수 값
 */
export const toInteger = (value: number | string | null | undefined): number => {
  if (value === null || value === undefined) return 0;
  
  const numValue = typeof value === "string" 
    ? parseFloat(value.replace(/[^\d.-]/g, "")) 
    : value;
    
  if (isNaN(numValue)) return 0;
  
  return Math.floor(numValue);
};

/**
 * 금액을 포맷팅하고 원화 표시를 추가합니다.
 * @param value 포맷팅할 숫자 또는 숫자 문자열
 * @returns 포맷팅된 문자열 (예: "91,953 원")
 */
export const formatWithKRW = (
  value: number | string | null | undefined
): string => {
  return `${formatCurrency(value)} 원`;
};

export default formatCurrency; 