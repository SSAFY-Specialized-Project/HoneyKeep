

// 메인 내 계좌정보 옆 인포 아이콘 누르면 나오는 말풍선
const InfoBubble = () => {
  return (
    <div className="relative max-w-md bg-[#F7F7F7] text-gray-800 text-sm rounded-xl p-4 shadow-md before:absolute before:content-[''] before:top-0 before:left-1/2 before:-translate-x-1/2 before:-translate-y-full before:border-8 before:border-transparent before:border-b-[#F7F7F7]">
      여유 자산은{" "}
      <strong className="font-semibold text-gray-900">
        잔액에서 계좌에 연결된 포켓의 총 금액과 고정지출을 뺀 금액
      </strong>
      이에요. 예정된 지출을 다 하고 난 뒤 남은 금액을 예측해볼 수 있어요.
    </div>
  );
};

export default InfoBubble;
