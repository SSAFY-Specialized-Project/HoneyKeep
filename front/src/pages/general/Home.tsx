import {
  AccountInfo,
  AccountPocketInfo,
  AccountSimpleInfo,
} from "@/entities/account/ui";
import { ContentAddBox } from "@/shared/ui";
import { BasicHeader } from "@/widgets";

const Home = () => {
  return (
    <div className="flex flex-col gap-2">
      <BasicHeader />
      <AccountInfo
        bank="우리은행"
        account="저축예금계좌"
        currentAmount={1000000}
        remainingAmount={820000}
        onClick={() => {}}
        onClickSend={() => {}}
      />
      <AccountPocketInfo
        id="1"
        bank="우리은행"
        account="저축예금계좌"
        accountNumber="1002-549-123456"
        currentAmount={1000000}
        remainingAmount={300000}
        pocketCount={3}
      />
      <AccountSimpleInfo
        bank="우리은행"
        account="저축예금계좌"
        accountNumber="1002-549-123456"
        currentAmount={1000000}
      />
      <ContentAddBox text="내 자산 추가하기" onClick={() => {}} />
    </div>
  );
};

export default Home;
