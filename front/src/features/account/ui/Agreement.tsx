import React from "react";

interface AgreementProps {
  onConfirm: () => void;
  userName: string;
}

// 사용자 이름 받아서 동의문 보여주기
/**
 * 사용 예시 : <Agreement
        userName="김종명"
        onConfirm={() => {
          // 라우팅 처리(인증서 선택 페이직로)
        }}
      /> 
 * */
const Agreement: React.FC<AgreementProps> = ({ onConfirm, userName }) => {
  return (
    <div className="p-6 text-sm text-gray-900 leading-relaxed">
      <h1 className="text-xl font-bold mb-4">{userName}님의 계좌를</h1>
      <h2 className="text-xl font-bold mb-6">확인하기 위한 동의문이에요</h2>

      <section className="mb-6">
        <h3 className="font-semibold mb-1">
          개인정보 및 금융정보 수집·이용 동의
        </h3>
        <ul className="list-disc ml-5">
          <li>
            수집 항목: 이름, 생년월일, 휴대폰번호, 계좌번호, 은행명, 계좌 잔액,
            거래내역 등
          </li>
          <li>수집 목적: 계좌 연동, 자산 현황 분석 및 관리 기능 제공</li>
          <li>보유 기간: 회원 탈퇴 시 또는 관련 법령에 따른 보존 기간까지</li>
        </ul>
        <p className="text-xs text-gray-600 mt-1">
          ※ 동의를 거부할 경우 계좌 연동 기능을 이용하실 수 없습니다.
        </p>
      </section>

      <section className="mb-6">
        <h3 className="font-semibold mb-1">개인정보 제3자 제공 동의</h3>
        <ul className="list-disc ml-5">
          <li>
            제공받는 자: 금융결제원, 해당 금융기관, 마이데이터 운영 기관 등
          </li>
          <li>제공 항목: 이름, 생년월일, 계좌정보, 인증 결과 등</li>
          <li>
            제공 목적: 금융기관 계좌 소유자 확인, 1원 인증 수행, 계좌정보 조회
          </li>
          <li>
            보유 기간: 이용 목적 달성 시까지 또는 관련 법령에 따른 보존 기간까지
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="font-semibold mb-1">고유식별정보 처리 동의</h3>
        <ul className="list-disc ml-5">
          <li>처리 항목: 주민등록번호, 계좌번호</li>
          <li>
            처리 목적: 실명 확인, 금융기관과의 연동 및 계좌 인증 절차 수행
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="font-semibold mb-1">1원 인증 동의</h3>
        <ul className="list-disc ml-5">
          <li>
            꿀킵은 사용자의 계좌 소유 여부 확인을 위해 금융기관을 통해 1원을
            송금하고, 입금자명을 통해 인증번호를 제공합니다.
          </li>
          <li>
            인증번호 입력을 통해 계좌 소유자임이 확인되면, 해당 계좌 정보가
            연동됩니다.
          </li>
        </ul>
      </section>

      <p className="text-xs text-gray-500 mb-6">
        연동된 계좌 정보는 꿀킵 앱에서 확인 및 삭제하실 수 있으며, 연동 해제 시
        더 이상 데이터를 수집하지 않습니다.
        <br />
        마이데이터 서비스는 언제든지 마이데이터 종합포털에서 확인 및 철회하실 수
        있습니다.
      </p>

      <button
        className="w-full bg-brand-primary-500 text-white rounded-xl py-4 font-bold text-text-xl hover:bg-brand-primary-300"
        onClick={onConfirm}
      >
        동의하기
      </button>
    </div>
  );
};

export default Agreement;
