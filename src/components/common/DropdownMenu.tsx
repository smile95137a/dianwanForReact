import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@/store';
import { clearAuthData } from '@/store/slices/frontend/authSlice';
import NumberFormatter from './NumberFormatter';
import iconG from '@/assets/image/di-icon-g.png';
import iconS from '@/assets/image/di-icon-s.png';
import iconB from '@/assets/image/di-icon-b.png';
interface DropdownItem {
  label: string;
  link: string;
  coins?: number;
  className?: string;
  icon?: React.ReactNode;
}

interface DropdownMenuProps {
  links: DropdownItem[];
  coins: DropdownItem[];
  className?: string;
  icon?: React.ReactNode;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  links,
  coins,
  className,
  icon,
}) => {
  const user = useSelector((state: RootState) => state.frontend.auth.user);
  const userCoins = useSelector(
    (state: RootState) => state.frontend.auth.coins
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [positionStyle, setPositionStyle] = useState({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    dispatch(clearAuthData());
    navigate('/login');
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let newPosition: Record<string, string> = {};

      // Adjust horizontal position to prevent overflow
      if (dropdownRect.right > viewportWidth) {
        newPosition.left = `${viewportWidth - dropdownRect.right}px`;
      } else if (dropdownRect.left < 0) {
        newPosition.left = `${-dropdownRect.left}px`;
      } else {
        newPosition.left = '-100px';
      }

      // Adjust vertical position
      if (dropdownRect.bottom > viewportHeight) {
        newPosition.bottom = `${dropdownRect.height}px`;
      } else {
        newPosition.top = '100%';
      }

      setPositionStyle(newPosition);
    }
  }, [isOpen]);

  return (
    <div
      ref={dropdownRef}
      className={`dropdown-menu dropdown-menu--${className || ''} ${
        isOpen ? 'dropdown-menu--open' : ''
      }`}
    >
      <div onClick={toggleDropdown} className="dropdown-menu__trigger">
        {icon && <span className="dropdown-menu__trigger-icon">{icon}</span>}
        <span>
          {user?.nickname
            ? user.nickname.length > 3
              ? `${user.nickname.substring(0, 3)}...`
              : user.nickname
            : '...'}
        </span>
      </div>

      {isOpen && (
        <div className="dropdown-menu__content" style={positionStyle}>
          {coins.map((item, index) => (
            <div
              key={index}
              className={`dropdown-menu__item dropdown-menu__item--coins dropdown-menu__item--${
                item.className || ''
              }`}
            >
              {item.icon && (
                <>
                  {item.icon === 'G' && (
                    <img
                      src={iconG}
                      className="dropdown-menu__item-icon"
                      alt="Gold Icon"
                    />
                  )}
                  {item.icon === 'S' && (
                    <img
                      src={iconS}
                      className="dropdown-menu__item-icon"
                      alt="Silver Icon"
                    />
                  )}
                  {item.icon === 'B' && (
                    <img
                      src={iconB}
                      className="dropdown-menu__item-icon"
                      alt="Silver Icon"
                    />
                  )}
                </>
              )}
              {item.coins !== undefined && (
                <span className="dropdown-menu__item-coins">
                  <NumberFormatter number={item.coins} />
                </span>
              )}
            </div>
          ))}

          {links.map((item, index) => (
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

          <div
            className="dropdown-menu__item justify-center"
            onClick={handleLogout}
          >
            登出
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
