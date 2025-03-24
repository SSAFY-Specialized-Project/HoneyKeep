import { BasicInput, Button } from "@/shared/ui";
import RegisterInput from "@/shared/ui/RegisterInput/RegisterInput";
import { useLogin } from "@/features/auth/login";

const LoginForm = () => {
  const {
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
  } = useLogin();

  return (
    <>
      <form method="POST" id="register" className="flex flex-col gap-3">
        <div className={``}>
          <BasicInput
            id="name"
            name="name"
            type="text"
            label="이름"
            value={name}
            onChange={handleNameInput}
          />
        </div>
        <div className={`${!nameCheck ? "hidden" : "block"}`}>
          <RegisterInput
            errorMessage={registerError}
            valueFirst={registerFirst}
            valueSecond={registerSecond}
            ref={registerRef}
            onChangeFirst={handleRegisterFirstInput}
            onChangeSecond={handleRegisterSecondInput}
          />
        </div>
        <div className={`${!registerCheck ? "hidden" : "block"}`}>
          <BasicInput
            id="phone"
            name="phone"
            type="tel"
            label="전화번호"
            value={phone}
            onChange={handlePhoneInput}
          />
        </div>
        <div className={`${!phoneCheck ? "hidden" : "block"}`}>
          <BasicInput
            errorMessage={emailError}
            id="email"
            name="email"
            type="email"
            label="이메일"
            buttonText="인증요청"
            disabled={!emailCheck}
            timer="00:00"
            onClick={(e) => {}}
            value={email}
            onChange={handleEmailInput}
          />
        </div>
        <div className={`${!emailCheck ? "hidden" : "block"}`}>
          <BasicInput
            id="certification"
            name="certification"
            type="certification"
            label="인증번호"
            value={certification}
            buttonText="인증하기"
            onClick={(e) => {}}
            onChange={handleCertificationInput}
          />
        </div>
      </form>
      <div className="mt-auto">
        <Button text="인증하기" type="button" disabled={true} />
      </div>
      <div className="hidden">
        <Button text="회원가입" type="submit" disabled={true} />
      </div>
    </>
  );
};

export default LoginForm;
