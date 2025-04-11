import { useEffect, useState } from "react";

interface Props{
  time: number;
  onTimeUp?: () => void;
}

const useCountdownTimer = ({time, onTimeUp}: Props) => {

  const [timeLeft, setTimeLeft] = useState<number>(time);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    // 타이머가 실행 중일 때만 인터벌 설정
    let intervalId: ReturnType<typeof setInterval> | undefined;
    
    if (isRunning && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // 타이머가 끝났을 때
      setIsRunning(false);
      // 여기에 타이머 종료 시 실행할 코드 추가
      if(onTimeUp){
        onTimeUp();
      }
    }

    // 컴포넌트 언마운트 또는 의존성 변경 시 인터벌 정리
    return () => {
      if(intervalId){
        clearInterval(intervalId);
      }
    }
  }, [isRunning, timeLeft, onTimeUp]);

  const formatTime = () => {
    const minutes: number = Math.floor(timeLeft / 60);
    const seconds: number = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const startTimer = () => {
    setIsRunning(true);
  }

  const pauseTimer = () => {
    setIsRunning(false);
  }

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(time);
  }

  return {formatTime, startTimer, pauseTimer, resetTimer}
}

export default useCountdownTimer;