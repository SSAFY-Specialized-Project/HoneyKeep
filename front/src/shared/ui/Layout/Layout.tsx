import { Outlet } from 'react-router';

interface Props {
  headerSlot?: React.ReactNode;
  navbarSlot?: React.ReactNode;
  modalSlot?: React.ReactNode;
}

const Layout = ({ headerSlot, navbarSlot, modalSlot }: Props) => {
  return (
    <div className="h-lvh w-lvw">
      <div
        className="relative mx-auto flex h-full max-w-[600px] min-w-[375px] flex-col"
        id="topLayout"
      >
        {headerSlot}
        <div className="flex-grow overflow-auto">
          <Outlet />
        </div>
        {navbarSlot}
        {modalSlot}
      </div>
    </div>
  );
};

export default Layout;
