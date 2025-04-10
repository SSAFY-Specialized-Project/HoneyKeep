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
        className="relative mx-auto flex h-full max-w-[600px] min-w-[350px] flex-col overflow-hidden"
        id="topLayout"
      >
        {headerSlot}
        <div className="flex-grow overflow-auto pb-5">
          <Outlet />
        </div>
        {navbarSlot}
        {modalSlot}
      </div>
    </div>
  );
};

export default Layout;
