import { Bank } from "@/shared/model/types";

interface Props {
  bank: Bank;
}

const BankIcon = ({ bank }: Props) => {
  const mapping = {
    시티은행: "citi",
    대구은행: "daegu",
    광주은행: "gwanjoo",
    기업은행: "ibk",
    한국은행: "korea",
    농협은행: "nh",
    산업은행: "sanup",
    SC제일은행: "sc",
    우리은행: "woori",
    국민은행: "kb",
  };

  //_sprite.svg#${mapping[bank]}
  return (
    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
      <svg width={20} height={20} viewBox="0 0 20 20">
        <use href={`/icon/bank/_sprite.svg#${mapping[bank]}`} />
      </svg>
    </div>
  );
};

export default BankIcon;
