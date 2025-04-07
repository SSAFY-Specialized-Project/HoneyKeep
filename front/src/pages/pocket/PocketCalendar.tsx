import getPocketListAPI from '@/entities/pocket/api/getPocketListAPI';
import { CustomCalendar } from '@/widgets/calendar/ui';
import { useSuspenseQuery } from '@tanstack/react-query';

const PocketCalendar = () => {
  const { data: productData } = useSuspenseQuery({
    queryKey: ['pocket-list-calendar'],
    queryFn: getPocketListAPI,
    staleTime: 30 * 1000 * 60,
  });

  return (
    <div className="mt-6">
      <CustomCalendar products={productData.data} />;
    </div>
  );
};

export default PocketCalendar;
