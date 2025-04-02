import { Outlet } from "react-router";

interface Props {
  headerSlot?: React.ReactNode;
  navbarSlot?: React.ReactNode;
}

const Layout = ({ headerSlot, navbarSlot }: Props) => {
  return (
    <div className="w-lvw h-lvh">
      <div
        className="max-w-[600px] min-w-[375px] h-full mx-auto relative flex flex-col"
        id="topLayout"
      >
        {headerSlot}
        <div className="flex-grow overflow-auto">
          <Outlet />
        </div>
        {navbarSlot}
      </div>
    </div>
  );
};

export default Layout;
