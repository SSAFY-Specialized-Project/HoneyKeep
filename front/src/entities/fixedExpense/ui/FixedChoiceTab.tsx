import { NavLink } from "react-router-dom";

const FixedChoiceTab = () => {
    return (
        <div className="flex w-full border-b border-gray-200">
            <NavLink
                to="/fixedExpense/list"
                className={({ isActive }) =>
                    `flex-1 text-xl font-medium text-center py-2 border-b-2 ${
                        isActive
                            ? "text-brand-primary-600 font-bold border-brand-primary-600"
                            : "text-gray-600 border-transparent"
                    }`
                }
            >
                고정지출 목록
            </NavLink>
            <NavLink
                to="/fixedExpense/found"
                className={({ isActive }) =>
                    `flex-1 text-xl font-medium text-center py-2 border-b-2 ${
                        isActive
                            ? "text-brand-primary-600 font-bold border-brand-primary-600"
                            : "text-gray-600 border-transparent"
                    }`
                }
                end
            >
                발견된 고정지출
                {location.pathname !== "/fixedExpense/found" && (
                    <span className="inline-block ml-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
            </NavLink>
        </div>
    );
};

export default FixedChoiceTab;
