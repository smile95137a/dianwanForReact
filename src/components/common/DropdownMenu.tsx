import React, { useState } from 'react';

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
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`dropdown-menu dropdown-menu--${className || ''} ${
        isOpen ? 'dropdown-menu--open' : ''
      }`}
    >
      <div onClick={toggleDropdown} className="dropdown-menu__trigger">
        {icon && <span className="dropdown-menu__trigger-icon">{icon}</span>}
        吳曉明
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
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
