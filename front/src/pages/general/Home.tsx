import {
  AccountInfo,
  AccountPocketInfo,
  AccountSimpleInfo,
} from "@/entities/account/ui";

import {
  FixedExpenseInfo,
  FixedExpenseTotal,
  FixedExpenseFound,
  FixedChoiceTab,
} from "@/entities/fixedExpense/ui";

import { CategoryCheck } from "@/entities/category/ui";

import { ContentAddBox } from "@/shared/ui";
import { BasicHeader } from "@/widgets";
import { GlobalNavigation } from "@/widgets/navigation/ui";
import { PocketChoiceTab } from "@/entities/pocket/ui";
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
      <FixedExpenseTotal count={5} totalAmount={100000} />
      <FixedChoiceTab />
      <PocketChoiceTab />
      <FixedExpenseInfo
        title="유튜브 프리미엄"
        paymentDate="23"
        amount={10900}
        monthCount={4}
        onClick={() => {}}
        onDelete={() => {}}
      />
      <FixedExpenseFound
        title="유튜브 프리미엄"
        paymentDate="23"
        amount={10900}
        monthCount={4}
        selectedAction={null}
        onRegister={() => {}}
        onModify={() => {}}
        onDelete={() => {}}
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
      <CategoryCheck
        imageId="1"
        name="생활비"
        pocketCount={5}
        checked={false}
        onChange={() => {}}
      />
      <GlobalNavigation />
    </div>
  );
};

export default Home;
