import { Button, Checkbox } from '@/shared/ui';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

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
  const [fifthCheck, setFifthCheck] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);

  // 각 약관 내용 토글 상태 관리
  const [firstOpen, setFirstOpen] = useState<boolean>(false);
  const [secondOpen, setSecondOpen] = useState<boolean>(false);
  const [thirdOpen, setThirdOpen] = useState<boolean>(false);
  const [fourthOpen, setFourthOpen] = useState<boolean>(false);
  const [fifthOpen, setFifthOpen] = useState<boolean>(false);

  useEffect(() => {
    if (firstCheck && secondCheck && thirdCheck && fourthCheck && fifthCheck) setAllCheck(true);
    else setAllCheck(false);
    if (firstCheck && secondCheck && thirdCheck && fourthCheck && fifthCheck) setDisabled(false);
    else setDisabled(true);
  }, [firstCheck, secondCheck, thirdCheck, fourthCheck, fifthCheck]);

  // 약관 내용 데이터
  const termsContents = {
    first:
      '<strong>제1조 (목적)</strong>\n이 약관은 꿀킵(이하 \'회사\')이 제공하는 서비스의 이용 조건, 절차 및 이용자와 회사 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.\n<strong>제2조 (정의)</strong>\n① "서비스"란 회사가 제공하는 금융정보 통합조회, 자산 관리, 알림, 분석 등의 모든 관련 서비스를 의미합니다.\n② "회원"이란 본 약관에 동의하고 서비스를 이용하는 이용자를 말합니다.\n<strong>제3조 (이용 계약의 체결)</strong>\n회원은 약관 동의 및 회사가 요구하는 정보를 입력함으로써 서비스 이용 계약을 체결합니다.\n<strong>제4조 (회원의 의무)</strong>\n① 회원은 관계 법령, 본 약관 및 서비스 이용 안내 사항을 준수해야 합니다.\n② 회원은 타인의 정보를 도용하거나 부정하게 이용해서는 안 됩니다.\n<strong>제5조 (서비스의 중단 및 변경)</strong>\n회사는 천재지변, 시스템 장애, 법령 변경 등 불가피한 사유가 발생할 경우 서비스 제공을 일시 중단하거나 변경할 수 있습니다.\n<strong>제6조 (면책 조항)</strong>\n회사는 무료로 제공되는 서비스에 대해 고의 또는 중과실이 없는 한 책임을 지지 않습니다.',
    second:
      '<strong>수집 항목</strong>\n이름, 생년월일, 성별, 휴대폰번호, 이메일, 내/외국인 여부 등\n<strong>수집 목적</strong>\n- 회원가입 및 본인 인증\n- 서비스 제공 및 이용자 식별\n- 고객 상담 및 민원 처리\n<strong>보유 및 이용 기간</strong>\n회원 탈퇴 시까지. 단, 관계 법령에 따라 일정 기간 보존할 수 있음 (예: 전자금융거래법, 통신비밀보호법 등)\n<strong>동의 거부 권리 및 불이익</strong>\n이용자는 개인정보 수집에 동의하지 않을 권리가 있으며, 이 경우 회원가입 및 서비스 이용이 제한될 수 있습니다.',
    third:
      '<strong>제공받는 자</strong>\n금융회사, 금융결제원, 마이데이터 기관, 기타 제휴 서비스 제공 업체\n<strong>제공 항목</strong>\n이름, 생년월일, 휴대폰번호, 계좌정보 등\n<strong>제공 목적</strong>\n서비스 이용을 위한 금융정보 연동 및 제휴 서비스 제공\n<strong>보유 및 이용 기간</strong>\n해당 기관의 이용 목적 달성 시까지 또는 법령에 따른 보관 기간\n<strong>동의 거부 권리 및 불이익</strong>\n동의하지 않을 경우 일부 서비스 이용이 제한될 수 있습니다.',
    fourth:
      '<strong>제1조 (목적)</strong>\n본 약관은 꿀킵이 제공하는 전자금융거래서비스의 이용 조건과 절차, 이용자와 회사의 권리 및 의무를 정함을 목적으로 합니다.\n<strong>제2조 (전자금융거래의 정의)</strong>\n"전자금융거래"란 이용자가 전자적 수단을 통해 자금을 이체하거나 조회하는 행위를 말합니다.\n<strong>제3조 (이용자의 의무)</strong>\n이용자는 비밀번호 등 접근매체를 선량한 관리자의 주의로 관리해야 하며, 제3자에게 양도·대여할 수 없습니다.\n<strong>제4조 (사고 처리)</strong>\n이용자가 비인가 거래나 시스템 오류로 인해 손해를 입은 경우, 관련 법령에 따라 회사는 책임을 집니다.\n<strong>제5조 (거래 기록 보존)</strong>\n회사는 전자금융거래 기록을 최소 5년간 보존합니다.',
    fifth:
      '<strong>수집 및 이용 항목</strong>\n주민등록번호, 계좌번호, 카드번호 등 고유식별정보\n<strong>처리 목적</strong>\n- 본인 확인 및 실명 인증\n- 금융기관 연동 시 신원 검증\n- 전자금융거래 처리\n<strong>보유 및 이용 기간</strong>\n회원 탈퇴 시까지 또는 관련 법령에 따라 보존 필요 시까지\n<strong>동의 거부 권리 및 불이익</strong>\n고유식별정보 제공에 동의하지 않을 경우, 본인 인증 및 서비스 이용이 제한될 수 있습니다.',
  };

  // 약관 내용을 HTML로 표시하기 위한 함수
  const renderHTML = (html: string) => {
    return { __html: html };
  };

  return (
    <div
      onClick={() => {
        setIsOpen(false);
      }}
      className={`absolute z-40 flex h-full w-full flex-col bg-gray-900/50 ${isOpen ? 'block' : 'hidden'} top-0 left-0`}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="mt-auto flex max-h-[80vh] flex-col gap-5 overflow-y-auto rounded-t-3xl bg-white p-6"
      >
        <div className="flex items-center justify-between">
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
              setFifthCheck(e.currentTarget.checked);
            }}
          />
          <img
            src="/icon/assets/x-lg.svg"
            alt="닫기"
            className="h-6 w-6 cursor-pointer"
            onClick={() => setIsOpen(false)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <div className="flex items-center justify-between">
              <Checkbox
                text="[필수] 서비스 이용약관"
                isChecked={firstCheck}
                onChange={(e) => {
                  setFirstCheck(e.currentTarget.checked);
                }}
              />
              <img
                src="/icon/assets/chevron-down.svg"
                alt="펼치기"
                className={`h-5 w-5 cursor-pointer transition-transform duration-300 ${firstOpen ? 'rotate-180' : ''}`}
                onClick={() => setFirstOpen(!firstOpen)}
              />
            </div>
            {firstOpen && (
              <div
                className="mt-2 rounded-lg bg-gray-50 p-3 text-sm whitespace-pre-line text-gray-700"
                dangerouslySetInnerHTML={renderHTML(termsContents.first)}
              />
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Checkbox
                text="[필수] 개인정보 수집 및 이용 동의"
                isChecked={secondCheck}
                onChange={(e) => {
                  setSecondCheck(e.currentTarget.checked);
                }}
              />
              <img
                src="/icon/assets/chevron-down.svg"
                alt="펼치기"
                className={`h-5 w-5 cursor-pointer transition-transform duration-300 ${secondOpen ? 'rotate-180' : ''}`}
                onClick={() => setSecondOpen(!secondOpen)}
              />
            </div>
            {secondOpen && (
              <div
                className="mt-2 rounded-lg bg-gray-50 p-3 text-sm whitespace-pre-line text-gray-700"
                dangerouslySetInnerHTML={renderHTML(termsContents.second)}
              />
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Checkbox
                text="[필수] 개인정보 제3자 제공 동의"
                isChecked={thirdCheck}
                onChange={(e) => {
                  setThirdCheck(e.currentTarget.checked);
                }}
              />
              <img
                src="/icon/assets/chevron-down.svg"
                alt="펼치기"
                className={`h-5 w-5 cursor-pointer transition-transform duration-300 ${thirdOpen ? 'rotate-180' : ''}`}
                onClick={() => setThirdOpen(!thirdOpen)}
              />
            </div>
            {thirdOpen && (
              <div
                className="mt-2 rounded-lg bg-gray-50 p-3 text-sm whitespace-pre-line text-gray-700"
                dangerouslySetInnerHTML={renderHTML(termsContents.third)}
              />
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Checkbox
                text="[필수] 전자금융거래 이용약관"
                isChecked={fourthCheck}
                onChange={(e) => {
                  setFourthCheck(e.currentTarget.checked);
                }}
              />
              <img
                src="/icon/assets/chevron-down.svg"
                alt="펼치기"
                className={`h-5 w-5 cursor-pointer transition-transform duration-300 ${fourthOpen ? 'rotate-180' : ''}`}
                onClick={() => setFourthOpen(!fourthOpen)}
              />
            </div>
            {fourthOpen && (
              <div
                className="mt-2 rounded-lg bg-gray-50 p-3 text-sm whitespace-pre-line text-gray-700"
                dangerouslySetInnerHTML={renderHTML(termsContents.fourth)}
              />
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Checkbox
                text="[필수] 고유식별정보 처리 동의"
                isChecked={fifthCheck}
                onChange={(e) => {
                  setFifthCheck(e.currentTarget.checked);
                }}
              />
              <img
                src="/icon/assets/chevron-down.svg"
                alt="펼치기"
                className={`h-5 w-5 cursor-pointer transition-transform duration-300 ${fifthOpen ? 'rotate-180' : ''}`}
                onClick={() => setFifthOpen(!fifthOpen)}
              />
            </div>
            {fifthOpen && (
              <div
                className="mt-2 rounded-lg bg-gray-50 p-3 text-sm whitespace-pre-line text-gray-700"
                dangerouslySetInnerHTML={renderHTML(termsContents.fifth)}
              />
            )}
          </div>
        </div>
        <Button
          text="동의하고 진행하기"
          // size="big"
          onClick={() => {
            setIsOpen(false);
            setPasswordOpen(true);
          }}
          disabled={disabled}
          className="text-white"
        />
      </div>
    </div>
  );
};

export default AgreementModal;
