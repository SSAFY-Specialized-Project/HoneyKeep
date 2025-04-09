// utils/addCommas.ts
const addCommas = (value: number | string): string => {
  if (value === null || value === undefined) return '';

  const num =
    typeof value === 'string'
      ? parseFloat(value.replace(/,/g, '')) // 기존 콤마 제거 후 숫자 변환
      : value;

  if (isNaN(num)) return '';

  return num.toLocaleString(); // 콤마 추가
};

export default addCommas;
