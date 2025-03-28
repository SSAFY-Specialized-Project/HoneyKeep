import { Button, Checkbox } from "@/shared/ui";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setPasswordOpen: Dispatch<SetStateAction<boolean>>;
}

const AgreementModal = ({ isOpen, setIsOpen, setPasswordOpen }: Props) => {
  const [allCheck, setAllCheck] = useState<boolean>(false);
  const [firstCheck, setFirstCheck] = useState<boolean>(false);
  const [secondCheck, setSecondCheck] = useState<boolean>(false);
  const [thirdCheck, setThirdCheck] = useState<boolean>(false);
  const [fourthCheck, setFourthCheck] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);

  useEffect(() => {
    if (firstCheck && secondCheck && thirdCheck && fourthCheck)
      setAllCheck(true);
    else setAllCheck(false);
    if (firstCheck && secondCheck && thirdCheck) setDisabled(false);
    else setDisabled(true);
  }, [firstCheck, secondCheck, thirdCheck, fourthCheck]);

  return (
    <div
      onClick={() => {
        setIsOpen(false);
      }}
      className={`absolute bg-gray-900/50 w-full h-full z-40 flex flex-col ${isOpen ? "block" : "hidden"} top-0 left-0`}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="flex flex-col mt-auto bg-white p-6 rounded-t-3xl gap-5"
      >
        <Checkbox
          text="모두 동의하기"
          size="big"
          isChecked={allCheck}
          onChange={(e) => {
            setAllCheck(e.currentTarget.checked);
            setFirstCheck(e.currentTarget.checked);
            setSecondCheck(e.currentTarget.checked);
            setThirdCheck(e.currentTarget.checked);
            setFourthCheck(e.currentTarget.checked);
          }}
          onClick={() => {}}
        />
        <div className="flex flex-col gap-2">
          <Checkbox
            text="개인정보 보호 동의 1"
            isChecked={firstCheck}
            onChange={(e) => {
              setFirstCheck(e.currentTarget.checked);
            }}
            onClick={() => {}}
          />
          <Checkbox
            text="개인정보 보호 동의 2"
            isChecked={secondCheck}
            onChange={(e) => {
              setSecondCheck(e.currentTarget.checked);
            }}
            onClick={() => {}}
          />
          <Checkbox
            text="개인정보 보호 동의 3"
            isChecked={thirdCheck}
            onChange={(e) => {
              setThirdCheck(e.currentTarget.checked);
            }}
            onClick={() => {}}
          />
          <Checkbox
            text="[선택] 개인정보 보호 동의 4"
            isChecked={fourthCheck}
            onChange={(e) => {
              setFourthCheck(e.currentTarget.checked);
            }}
            onClick={() => {}}
          />
        </div>
        <Button
          text="동의하고 진행하기"
          // size="big"
          onClick={() => {
            setIsOpen(false);
            setPasswordOpen(true);
          }}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default AgreementModal;
