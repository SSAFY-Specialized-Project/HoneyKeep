type YYYYMMDD = `${number}-${number}-${number}`;

const convertCurrentTime = (date: YYYYMMDD | "") => {

  if(date == null) return null;

  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const dateTimeWithCurrentTime = `${date}T${hours}:${minutes}:${seconds}`;

  return dateTimeWithCurrentTime;
}

export default convertCurrentTime;