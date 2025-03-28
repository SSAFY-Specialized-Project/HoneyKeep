import { NavItem } from "@/shared/ui";

const GlobalNavigation = () => {
  return (
    <nav className="flex justify-between items-center w-full px-9 py-4">
      <NavItem path="/home" text="홈" />
      <NavItem path="/pocket/list" text="내 포켓" />
      <NavItem path="/pocket/calendar" text="캘린더" />
      <NavItem path="/fixedExpense" text="고정지출" />
      <NavItem path="/setting" text="설정" />
    </nav>
  );
};

export default GlobalNavigation;
