import { NavLink } from 'react-router-dom';
import { DetectedFixedExpenseResponse } from '@/entities/fixedExpense/model/types.ts';

type Props = {
  detectedFixedExpenses: DetectedFixedExpenseResponse[];
};

const FixedChoiceTab = ({ detectedFixedExpenses = [] }: Props) => {
  const hasDetectedExpenses = detectedFixedExpenses.length > 0;

  return (
    <div className="flex w-full border-b border-gray-200">
      <NavLink
        to="/fixedExpense/list"
        className={({ isActive }) =>
          `flex-1 border-b-2 py-2 text-center text-xl font-medium ${
            isActive
              ? 'text-brand-primary-600 border-brand-primary-500 font-bold'
              : 'border-transparent text-gray-600'
          }`
        }
      >
        고정지출 목록
      </NavLink>
      <NavLink
        to="/fixedExpense/found"
        className={({ isActive }) =>
          `relative flex-1 border-b-2 py-2 text-center text-xl font-medium ${
            isActive
              ? 'text-brand-primary-600 border-brand-primary-500 font-bold'
              : 'border-transparent text-gray-600'
          }`
        }
        end
      >
        발견된 고정지출
        {hasDetectedExpenses && (
          <span className="absolute top-2.5 right-18 h-2 w-2 rounded-full bg-red-500"></span>
        )}
      </NavLink>
    </div>
  );
};

export default FixedChoiceTab;
