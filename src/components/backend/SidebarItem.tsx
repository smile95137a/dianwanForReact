import { NavLink } from 'react-router-dom';

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  to: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, to }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `bsidebar__item ${isActive ? 'bsidebar__item--active' : ''}`
      }
    >
      <div className="bsidebar__item-icon">{icon}</div>
      <div className="bsidebar__item-text">{text}</div>
    </NavLink>
  );
};

export default SidebarItem;
