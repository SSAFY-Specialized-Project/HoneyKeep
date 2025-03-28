import { NavLink } from "react-router-dom";

const FixedChoiceTab = () => {
  return (
    <div className="flex w-full border-b border-gray-200">
      <NavLink
        to="/fixed-expense/list"
        className={({ isActive }) =>
          `flex-1 text-[20px] font-pretendard leading-[150%] text-center py-[8px] border-b-2 ${
            isActive
              ? "text-[#FFAA00] font-bold border-[#FFAA00]"
              : "text-[#6A6A6A] font-medium border-transparent"
          }`
        }
      >
        고정지출 목록
      </NavLink>
      <NavLink
        to="/fixed-expense/found"
        className={({ isActive }) =>
          `flex-1 text-[20px] font-pretendard leading-[150%] text-center py-[8px] border-b-2 ${
            isActive
              ? "text-[#FFAA00] font-bold border-[#FFAA00]"
              : "text-[#6A6A6A] font-medium border-transparent"
          }`
        }
      >
        발견된 고정지출
      </NavLink>
    </div>
  );
};

export default FixedChoiceTab;
