import { NavLink } from "react-router-dom";

const FixedChoiceTab = () => {
  return (
    <div className="flex w-full border-b border-gray-200">
      <NavLink
        to="/fixed-expense/list"
        className={({ isActive }) =>
          `flex-1 text-text-xl font-medium text-center py-2 border-b-2 ${
            isActive
              ? "text-[var(--color-brand-primary-600)] font-bold border-[var(--color-brand-primary-600)]"
              : "text-gray-600 border-transparent"
          }`
        }
      >
        고정지출 목록
      </NavLink>
      <NavLink
        to="/fixed-expense/found"
        className={({ isActive }) =>
          `flex-1 text-text-xl font-medium text-center py-2 border-b-2 ${
            isActive
              ? "text-[var(--color-brand-primary-600)] font-bold border-[var(--color-brand-primary-600)]"
              : "text-gray-600 border-transparent"
          }`
        }
      >
        발견된 고정지출
      </NavLink>
    </div>
  );
};

export default FixedChoiceTab;
