const calculateDDay = (targetDate: Date | string | null) => {

  if(targetDate == null) return null;

  const target: Date = typeof targetDate === 'string' ? new Date(targetDate) : new Date(targetDate.getTime());

  const today: Date = new Date();

  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const diffTime: number = target.getTime() - today.getTime();

  const diffDays: number = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if(diffDays === 0){
    return "D-Day";
  }else if(diffDays > 0){
    return `D-${diffDays}`
  }else {
    return `D+${Math.abs(diffDays)}`
  }
}

export default calculateDDay;