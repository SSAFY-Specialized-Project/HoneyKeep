import { NavLink } from "react-router";

interface Props {
  path: string;
  text: string;
}

const NavItem = ({ path, text }: Props) => {
  return (
    <NavLink
      to={path}
      className={({ isActive }: { isActive: boolean }) =>
        `${isActive ? "text-gray-900" : "text-gray-600"} 
        flex flex-col gap-1 items-center`
      }
    >
      <div className="w-6 h-6 bg-gray-900"></div>
      <span>{text}</span>
    </NavLink>
  );
};

export default NavItem;
