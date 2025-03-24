import { useCountdownTimer } from "@/shared/hooks";
import { useEffect, useRef, useState } from "react";

const useLogin = () => {
  const { formatTime, startTimer, pauseTimer, resetTimer } = useCountdownTimer({
    time: 180,
    onTimeUp: () => {},
  });

  // 이메일 state
  const [email, setEmail] = useState<string>("");
  const [emailCheck, setEmailCheck] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("에러");

  // 이메일 인증 state
  const [certification, setCertification] = useState<string>("");
  const [certificationCheck, setCertificationCheck] = useState<boolean>(false);

  // 전화번호 state
  const [phone, setPhone] = useState<string>("");
  const [phoneCheck, setPhoneCheck] = useState<boolean>(false);

  // 이름 state
  const [name, setName] = useState<string>("");
  const [nameCheck, setNameCheck] = useState<boolean>(false);

  // 주민등록번호 state
  const [registerFirst, setRegisterFirst] = useState<string>("");
  const [registerSecond, setRegisterSecond] = useState<string>("");
  const [registerCheck, setRegisterCheck] = useState<boolean>(false);
  const [registerError, setRegisterError] = useState<string>("");

  const registerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (email.trim().length > 0) {
      setEmailCheck(regex.test(email));
    }

    if (email.trim().length > 0 && !emailCheck)
      setEmailError("이메일 형식이 올바르지 않습니다.");
    else setEmailError("");
  }, [email, emailCheck]);

  useEffect(() => {
    if (phone.trim().length > 0) {
      setPhoneCheck(true);
    }
  }, [phone]);

  useEffect(() => {
    if (name.trim().length > 0) {
      setNameCheck(true);
    }
  }, [name]);

  useEffect(() => {
    const regex = /^[1-4]$/;
    if (registerFirst.length > 0) setRegisterCheck(true);
    if (registerSecond.length > 0) {
      if (regex.test(registerSecond)) setRegisterError("");
      else setRegisterError("주민등록번호 형식이 올바르지 않습니다.");
    } else {
      setRegisterError("");
    }
  }, [registerFirst, registerSecond]);

  const handleNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.currentTarget.value);
  };

  const handleRegisterFirstInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.currentTarget) return;

    const value = e.currentTarget.value;

    if (!/^\d*$/.test(value)) return;
    if (!registerRef.current) return;
    if (value.length > 5) {
      registerRef.current.focus();
    }

    setRegisterFirst(value);
  };

  const handleRegisterSecondInput = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.currentTarget) return;

    const value = e.currentTarget.value;

    if (!/^\d*$/.test(value)) return;
    if (value.length > 1) return;
    setRegisterSecond(value);
  };

  const handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value);
  };

  const handleCertificationInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCertification(e.currentTarget.value);
  };

  const sendEmailCode = (e: React.MouseEvent<HTMLButtonElement>) => {};

  return {
    name,
    nameCheck,
    registerFirst,
    registerSecond,
    registerRef,
    registerError,
    registerCheck,
    phone,
    phoneCheck,
    email,
    emailCheck,
    emailError,
    certification,
    handleNameInput,
    handlePhoneInput,
    handleRegisterFirstInput,
    handleRegisterSecondInput,
    handleEmailInput,
    handleCertificationInput,
  };
};

export default useLogin;
