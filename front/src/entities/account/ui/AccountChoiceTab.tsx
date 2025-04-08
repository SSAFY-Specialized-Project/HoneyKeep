import { NavLink } from 'react-router-dom';

const AccountChoiceTab = () => {
  return (
    <div className="flex w-full border-b border-gray-200">
      <NavLink
        to="transactions"
        className={({ isActive }) =>
          `flex-1 border-b-2 py-2 text-center text-xl font-medium ${
            isActive
              ? 'text-brand-primary-500 border-brand-primary-500 font-bold'
              : 'border-transparent text-gray-600'
          }`
        }
      >
        거래내역
      </NavLink>
      <NavLink
        to="pockets"
        className={({ isActive }) =>
          `flex-1 border-b-2 py-2 text-center text-xl font-medium ${
            isActive
              ? 'text-brand-primary-500 border-brand-primary-500 font-bold'
              : 'border-transparent text-gray-600'
          }`
        }
        end
      >
        포켓 목록
      </NavLink>
    </div>
  );
};

export default AccountChoiceTab;
