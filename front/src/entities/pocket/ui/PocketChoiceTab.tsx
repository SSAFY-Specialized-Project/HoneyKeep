import { NavLink } from 'react-router-dom';

const PocketChoiceTab = () => {
  return (
    <div className="flex w-full border-b border-gray-200">
      <NavLink
        to="/pocket/create/link"
        className={({ isActive }) =>
          `text-text-xl flex-1 border-b-2 py-2 text-center font-medium ${
            isActive
              ? 'border-[var(--color-brand-primary-500)] font-bold text-[var(--color-brand-primary-500)]'
              : 'border-transparent text-gray-600'
          }`
        }
      >
        링크로 추가하기
      </NavLink>
      <NavLink
        to="/pocket/create/favorite"
        className={({ isActive }) =>
          `text-text-xl flex-1 border-b-2 py-2 text-center font-medium ${
            isActive
              ? 'border-[var(--color-brand-primary-500)] font-bold text-[var(--color-brand-primary-500)]'
              : 'border-transparent text-gray-600'
          }`
        }
      >
        즐겨찾는 포켓
      </NavLink>
      <NavLink
        to="/pocket/create/"
        className={({ isActive }) =>
          `text-text-xl flex-1 border-b-2 py-2 text-center font-medium ${
            isActive
              ? 'border-[var(--color-brand-primary-500)] font-bold text-[var(--color-brand-primary-500)]'
              : 'border-transparent text-gray-600'
          }`
        }
        end
      >
        직접 추가하기
      </NavLink>
    </div>
  );
};

export default PocketChoiceTab;
