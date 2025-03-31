import { NavLink } from "react-router-dom";

const PocketChoiceTab = () => {
  return (
    <div className="flex w-full border-b border-gray-200">
      <NavLink
        to="/pocket/link"
        className={({ isActive }) =>
          `flex-1 text-text-xl font-medium text-center py-2 border-b-2 ${
            isActive
              ? "text-[var(--color-brand-primary-600)] font-bold border-[var(--color-brand-primary-600)]"
              : "text-gray-600 border-transparent"
          }`
        }
      >
        링크로 추가하기
      </NavLink>
      <NavLink
        to="/pocket/favorite"
        className={({ isActive }) =>
          `flex-1 text-text-xl font-medium text-center py-2 border-b-2 ${
            isActive
              ? "text-[var(--color-brand-primary-600)] font-bold border-[var(--color-brand-primary-600)]"
              : "text-gray-600 border-transparent"
          }`
        }
      >
        즐겨찾는 포켓
      </NavLink>
      <NavLink
        to="/pocket/direct"
        className={({ isActive }) =>
          `flex-1 text-text-xl font-medium text-center py-2 border-b-2 ${
            isActive
              ? "text-[var(--color-brand-primary-600)] font-bold border-[var(--color-brand-primary-600)]"
              : "text-gray-600 border-transparent"
          }`
        }
      >
        직접 추가하기
      </NavLink>
    </div>
  );
};

export default PocketChoiceTab;
