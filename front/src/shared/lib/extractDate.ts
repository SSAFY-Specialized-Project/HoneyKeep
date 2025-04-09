type DateTimeString = `${string}T${string}`;

const extractDate = (dateTime: DateTimeString | null | string | null) => {
  if (dateTime == null || dateTime === "") return "";
  
  // 'T'를 기준으로 문자열을 분리하여 날짜 부분만 추출
  const [date] = dateTime.split('T');
  
  return date;
}

export default extractDate;