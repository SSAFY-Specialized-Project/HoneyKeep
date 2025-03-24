import { Outlet } from "react-router";

interface Props {
  headerSlot?: React.ReactNode;
  navbarSlot?: React.ReactNode;
}

const Layout = ({ headerSlot, navbarSlot }: Props) => {
  return (
    <div className="w-lvw h-lvh">
      <div className="max-w-[600px] min-w-[375px] h-full mx-auto">
        {headerSlot}
        <div className="w-full h-full">
          <Outlet />
        </div>
        {navbarSlot}
      </div>
    </div>
  );
};

export default Layout;
