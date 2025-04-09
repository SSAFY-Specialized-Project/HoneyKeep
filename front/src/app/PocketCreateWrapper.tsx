import usePocketCreateStore from '@/shared/store/usePocketCreateStore';
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';

const PocketCreateWrapper = () => {
  const location = useLocation();
  const resetBudget = usePocketCreateStore((state) => state.resetBudget);

  useEffect(() => {
    return () => {
      resetBudget();
    };
  }, [resetBudget]);

  // useEffect(() => {
  //   return () => {
  //     if (!location.pathname.includes('/budget')) {
  //       resetBudget();
  //     }
  //   };
  // });

  return <Outlet />;
};

export default PocketCreateWrapper;
