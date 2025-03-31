import { BankIcon, CategoryIcon, Icon } from "@/shared/ui";
import { BasicHeader } from "@/widgets";
import { GlobalNavigation } from "@/widgets/navigation/ui";

const Home = () => {
  return (
    <div className="flex flex-col gap-2">
      <BasicHeader />
      <BankIcon bank="시티은행" />
      <CategoryIcon category={1} />
      <Icon size="small" id="calendar-event" />
      <GlobalNavigation />
    </div>
  );
};

export default Home;
