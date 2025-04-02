import { NavLink } from "react-router";
import { Icon } from "@/shared/ui";

interface Props {
  icon: string;
  path: string;
  text: string;
}

const NavItem = ({ path, text, icon }: Props) => {
  return (
    <NavLink
      to={path}
      className={({ isActive }: { isActive: boolean }) =>
        `${isActive ? "text-gray-900" : "text-gray-600"} 
        flex flex-col gap-1 items-center`
      }
    >
      <Icon id={icon} size="small" />
      <span>{text}</span>
    </NavLink>
  );
};

export default NavItem;
