import loginUserAPI from "@/entities/user/api/loginUserAPI";
import registerUserAPI from "@/entities/user/api/registerUserAPI";
import sendVerificationAPI from "@/entities/user/api/sendVerificationAPI";
import validateUserAPI from "@/entities/user/api/validateUserAPI";
import verifyEmailCodeAPI from "@/entities/user/api/verifyEmailCodeAPI";
import { ResponseErrorDTO } from "@/shared/api/types";
import { useCountdownTimer } from "@/shared/hooks";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

const useLogin = () => {
  const navigate = useNavigate();
  const { formatTime, startTimer, pauseTimer, resetTimer } = useCountdownTimer({
    time: 180,
    onTimeUp: () => {},
  });

  // 이메일 state
  const [email, setEmail] = useState<string>("");
  const [emailCheck, setEmailCheck] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("에러");
  const [emailText, setEmailText] = useState<string>("인증요청");

  // 이메일 인증 state
  const [certification, setCertification] = useState<string>("");
  const [certificationText, setCertificationText] =
    useState<string>("인증하기");
  const [certificationCheck, setCertificationCheck] = useState<boolean>(false);
  const [certificationError, setCertificationError] = useState<string>("");

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

  // 동의사항 state
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  // 비밀번호 state
  const [password, setPassword] = useState<string>("");
  const [passwordCheck, setPasswordCheck] = useState<boolean>(true);
  const [isPasswordOpen, setPasswordOpen] = useState<boolean>(false);

  // 로그인이냐 회원가입이냐 state
  // true이면 로그인으로 false면 회원가입으로
  const [isAlready, setAlready] = useState<boolean>(false);

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

  useEffect(() => {
    if (certificationCheck) setModalOpen(true);
  }, [certificationCheck]);

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

  const sendEmailCode = async () => {
    const data = { email };
    resetTimer();

    const response = await sendVerificationAPI(data);

    if (response.status == 200) {
      startTimer();
      setEmailText("재요청");
    } else if (response.status == 500) {
      setEmailError("이메일 발송에 실패했습니다.");
      setEmailText("재요청");
      pauseTimer();
    }
  };

  const validateUserMutation = useMutation({
    mutationFn: validateUserAPI,
    onSuccess: (response) => {
      if (response.data) {
        console.log("로그인!");
        setAlready(true);
        setCertificationCheck(true);
      } else {
        console.log("회원가입!");
        setAlready(false);
        setCertificationCheck(true);
      }
    },
    onError: (error: ResponseErrorDTO) => {
      if (error.status == 400) {
        // 이미 사용중인 이메일
        setCertificationError(error.message);
        setCertificationCheck(false);
      } else if (error.status == 409) {
        // 이미 가입된 사용자
        setCertificationError(error.message);
        setCertificationCheck(false);
      }
    },
  });

  const verifyCodeMutation = useMutation({
    mutationFn: verifyEmailCodeAPI,
    onSuccess: () => {
      setCertificationText("인증완료");
      pauseTimer();
      validateUserMutation.mutate({
        name,
        identityNumber: registerFirst + "-" + registerSecond,
        phoneNumber:
          phone.slice(0, 3) +
          "-" +
          phone.slice(3, 7) +
          "-" +
          phone.slice(7, 11),
        email,
      });
    },
    onError: (error) => {
      setCertificationError(error.message);
      setCertificationCheck(false);
    },
  });

  const verifyEmailCode = () => {
    const data = { email, code: Number(certification) };
    verifyCodeMutation.mutate(data);
  };

  const loginUserMutation = useMutation({
    mutationFn: loginUserAPI,
    onSuccess: (response) => {
      const accessToken = response.data.accessToken;
      localStorage.setItem("accessToken", accessToken);
      navigate("/home");
    },
    onError: (error: ResponseErrorDTO) => {
      if (error.status == 401) {
        console.log("로그인 실패");
        setPasswordCheck(false);
      }
    },
  });

  const registerUserMutation = useMutation({
    mutationFn: registerUserAPI,
    onSuccess: () => {
      loginUserMutation.mutate({ email, password });
    },
  });

  useEffect(() => {
    if (password.length == 6) {
      if (isAlready) {
        // 로그인
        console.log("로그인 호출됨");
        loginUserMutation.mutate({ email, password });
      } else {
        // 회원가입
        console.log("회원가입 호출됨");
        registerUserMutation.mutate({
          name,
          identityNumber: registerFirst + "-" + registerSecond,
          phoneNumber:
            phone.slice(0, 3) +
            "-" +
            phone.slice(3, 7) +
            "-" +
            phone.slice(7, 11),
          email,
          password,
        });
      }
    } else {
      setPasswordCheck(true);
    }
  }, [password]);

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
    emailText,
    emailError,
    certification,
    certificationText,
    certificationError,
    certificationCheck,
    isModalOpen,
    isPasswordOpen,
    password,
    passwordCheck,
    setPassword,
    setModalOpen,
    setPasswordOpen,
    handleNameInput,
    handlePhoneInput,
    handleRegisterFirstInput,
    handleRegisterSecondInput,
    handleEmailInput,
    handleCertificationInput,
    formatTime,
    sendEmailCode,
    verifyEmailCode,
  };
};

export default useLogin;
