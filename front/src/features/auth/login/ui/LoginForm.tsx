import { BasicInput, Button } from "@/shared/ui";
import RegisterInput from "@/shared/ui/RegisterInput/RegisterInput";
import { AgreementModal, useLogin } from "@/features/auth/login";
import { createPortal } from "react-dom";
import PasswordModal from "./PasswordModal";

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
    emailText,
    emailError,
    certification,
    certificationCheck,
    certificationError,
    certificationText,
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
            buttonText={emailText}
            disabled={!emailCheck || certificationCheck}
            timer={formatTime()}
            onClick={sendEmailCode}
            value={email}
            onChange={handleEmailInput}
          />
        </div>
        <div className={`${!emailCheck ? "hidden" : "block"}`}>
          <BasicInput
            errorMessage={certificationError}
            id="certification"
            name="certification"
            type="certification"
            label="인증번호"
            buttonText={certificationText}
            disabled={certification.length < 6 || certificationCheck}
            value={certification}
            onClick={verifyEmailCode}
            onChange={handleCertificationInput}
          />
        </div>
      </form>
      <div className="mt-auto flex flex-col gap-8">
        <p className="text-text-lg font-bold text-gray-300">
          소중한 내 정보를 위해 마이데이터 서비스 가입은 충분히
          <br />
          검토해주세요. 꼭 필요한 서비스만 가입하고 잘 이용하지 않는
          <br />
          서비스는 탈퇴 및 삭제해주세요. 현재 가입하신 마이데이터 서비스
          <br />
          앱은 마이데이터 종합포털에서 확인할 수 있습니다.
        </p>
        <Button
          text="동의사항 확인하기"
          type="button"
          disabled={!certificationCheck}
          onClick={() => {
            setModalOpen(true);
          }}
        />
      </div>
      {isModalOpen &&
        document.getElementById("topLayout") &&
        createPortal(
          <AgreementModal
            isOpen={isModalOpen}
            setIsOpen={setModalOpen}
            setPasswordOpen={setPasswordOpen}
          />,
          document.getElementById("topLayout") as HTMLElement
        )}
      {isPasswordOpen &&
        document.getElementById("topLayout") &&
        createPortal(
          <PasswordModal
            isOpen={isPasswordOpen}
            value={password}
            setValue={setPassword}
            passwordCheck={passwordCheck}
          />,
          document.getElementById("topLayout") as HTMLElement
        )}
    </>
  );
};

export default LoginForm;
