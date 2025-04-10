const getTimeAgo = (timestamp:string) => {
  // 주어진 시간과 현재 시간을 Date 객체로 변환
  const givenTime = new Date(timestamp);
  const currentTime = new Date();
  
  // 유효한 날짜인지 확인
  if (isNaN(givenTime.getTime())) {
    return "유효하지 않은 시간 형식입니다";
  }
  
  // 시간 차이를 밀리초 단위로 계산
  const timeDifferenceMs = currentTime - givenTime;
  
  // 음수인 경우(미래 시간인 경우)
  if (timeDifferenceMs < 0) {
    return "미래 시간입니다";
  }
  
  // 분 단위로 변환
  const minutes = Math.floor(timeDifferenceMs / (1000 * 60));
  
  // 시간 단위로 변환
  const hours = Math.floor(minutes / 60);
  
  // 일 단위로 변환
  const days = Math.floor(hours / 24);
  
  // 결과 문자열 생성
  if (minutes < 1) {
    return "방금 전";
  } else if (minutes < 60) {
    return `${minutes}분 전`;
  } else if (hours < 24) {
    return `${hours}시간 전`;
  } else {
    return `${days}일 전`;
  }
}

export default getTimeAgo;