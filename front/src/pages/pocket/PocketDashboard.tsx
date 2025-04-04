import PocketInsightCard from '@/features/pocket/ui/PocketInsightCard';
import HeaderWithPeriodSelector from '@/features/pocket/ui/HeaderWithPeriodSelector';
import SpendingPatternCard from '@/features/pocket/ui/SpendingPatternCard';

export default function PocketDashboard() {
  return (
    <div className="max-w-full bg-[#f3f4f6] p-4 text-[#1f2937]">
      <HeaderWithPeriodSelector />
      <div className="flex flex-col gap-4">
        <SpendingPatternCard />
        <PocketInsightCard />
        {/* <ExceedingPocketCard /> */}
        {/* <AchievementCard /> */}
      </div>
    </div>
  );
}
