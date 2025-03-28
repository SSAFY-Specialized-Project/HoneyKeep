import { BankIcon } from "@/shared/ui";
import { Link } from "react-router";

interface Props {
  id: string;
  bank: string;
  account: string;
  accountNumber: string;
  currentAmount: number;
  remainingAmount: number;
  pocketCount: number;
}

const AccountPocketInfo = ({
  id,
  bank,
  account,
  accountNumber,
  currentAmount,
  remainingAmount,
  pocketCount,
}: Props) => {
  return (
    <li className="w-full shadow-custom list-none rounded-[1.25rem]">
      <Link
        to={`/accountDetail/${id}`}
        className="w-full flex flex-col gap-2.5 p-4"
      >
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-3">
            <BankIcon />
            <div className="flex flex-col">
              <span className="text-text-md font-medium text-gray-800">
                {account}
              </span>
              <span className="text-text-sm font-medium text-gray-600">{`${bank} ${accountNumber}`}</span>
            </div>
          </div>
          <span className="">{currentAmount} 원</span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="w-full flex justify-between">
            <span className="text-text-lg">포켓 후 잔액</span>
            <span className="text-text-lg font-semibold text-extra">
              {remainingAmount} 원
            </span>
          </div>
          <div className="w-full flex justify-between">
            <span className="text-text-sm text-gray-600">연결된 포켓</span>
            <span className="text-text-sm text-gray-600">{pocketCount} 개</span>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default AccountPocketInfo;
