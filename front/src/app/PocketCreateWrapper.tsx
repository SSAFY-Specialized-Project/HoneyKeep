import usePocketCreateStore from '@/shared/store/usePocketCreateStore';
import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';

const PocketCreateWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const resetBudget = usePocketCreateStore((state) => state.resetBudget);
  const name = usePocketCreateStore((state) => state.name);
  const totalAmount = usePocketCreateStore((state) => state.totalAmount);

  useEffect(() => {
    if (!location.pathname.includes('link')) {
      if (name == null || totalAmount == null) {
        navigate('/pocket/create');
      }
    }
  }, [location.pathname, name, totalAmount, navigate]);

  useEffect(() => {
    return () => {
      resetBudget();
    };
  }, [resetBudget]);

  return <Outlet />;
};

export default PocketCreateWrapper;
