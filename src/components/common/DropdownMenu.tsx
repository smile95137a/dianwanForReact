import { RootState } from '@/store';
import { clearAuthData } from '@/store/slices/frontend/authSlice';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

interface DropdownItem {
  label: string;
  link: string;
  className?: string;
  icon?: React.ReactNode;
}

interface DropdownMenuProps {
  items: DropdownItem[];
  className?: string;
  icon?: React.ReactNode;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  className,
  icon,
}) => {
  const user = useSelector((state: RootState) => state.frontend.auth.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    dispatch(clearAuthData());
    navigate('/login');
  };

  return (
    <div
      className={`dropdown-menu dropdown-menu--${className || ''} ${
        isOpen ? 'dropdown-menu--open' : ''
      }`}
    >
      <div onClick={toggleDropdown} className="dropdown-menu__trigger">
        {icon && <span className="dropdown-menu__trigger-icon">{icon}</span>}
        {user?.nickname}
      </div>
      {isOpen && (
        <div className="dropdown-menu__content">
          {items.map((item, index) => (
            <a
              key={index}
              href={item.link}
              className={`dropdown-menu__item ${item.className || ''}`}
            >
              {item.icon && (
                <span className="dropdown-menu__item-icon">{item.icon}</span>
              )}
              {item.label}
            </a>
          ))}
          <div className="dropdown-menu__item" onClick={handleLogout}>
            登出
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
