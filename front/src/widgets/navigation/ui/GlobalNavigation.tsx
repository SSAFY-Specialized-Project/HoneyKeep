import { NavItem } from '@/shared/ui';

const GlobalNavigation = () => {
  return (
    <nav className="shadow-nav flex w-full items-center justify-between px-9 py-4">
      <NavItem path="/home" text="홈" icon="home" />
      <NavItem path="/pocket/list" text="내 포켓" icon="pocket" />
      <NavItem path="/pocket/calendar" text="캘린더" icon="calendar" />
      <NavItem path="/fixedExpense" text="고정지출" icon="wallet" />
      <NavItem path="/setting" text="설정" icon="information" />
    </nav>
  );
};

export default GlobalNavigation;
