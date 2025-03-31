import { BankIcon, CategoryIcon, Icon } from "@/shared/ui";
import { BasicHeader } from "@/widgets";
import { GlobalNavigation } from "@/widgets/navigation/ui";
import PocketGatheringModal from "@/widgets/modal/ui/PocketGatheringModal";
const Home = () => {
  return (
    <div className="flex flex-col gap-2">
      <BasicHeader />
      <BankIcon bank="시티은행" />
      <CategoryIcon category={1} />
      <Icon size="small" id="calendar-event" />
      <GlobalNavigation />
      <PocketGatheringModal
        totalAmount={1000000}
        gatheredAmount={500000}
        isOpen={true}
        onClose={() => {}}
        onConfirm={() => {}}
      />
    </div>
  );
};

export default Home;
