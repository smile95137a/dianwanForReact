import React from 'react';
import logoImg from '@/assets/image/logo.png';
import { Link } from 'react-router-dom';
import {
  RiShieldStarLine,
  RiShoppingBagLine,
  RiUserLine,
} from 'react-icons/ri';
import { IoCartOutline } from 'react-icons/io5';
import { FaToolbox, FaBullhorn } from 'react-icons/fa';

const navItems = [
  { to: '/product', icon: <RiShieldStarLine />, label: '電玩賞' },
  { to: '/news', icon: <FaBullhorn />, label: '最新消息' },
  { to: '/mallProduct', icon: <RiShoppingBagLine />, label: '商城' },
  { to: '/product2', icon: <FaToolbox />, label: '賞品盒' },
  { to: '/memberCenter', icon: <RiUserLine />, label: '會員中心' },
  { to: '/cart', icon: <IoCartOutline />, label: '購物車' },
];

const Header = () => {
  return (
    <div className="fheader">
      <div className="fheader__logo">
        <Link to="/main">
          <img src={logoImg} className="ffheader__logo-img" alt="Logo" />
        </Link>
      </div>

      <div className="fheader__nav">
        <div className="fheader__nav-items">
          {navItems.map((item, index) => (
            <Link key={index} className="fheader__nav-item" to={item.to}>
              <div className="fheader__nav-item-icon">{item.icon}</div>
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="fheader__btns">
        <Link className="fheader__btn fheader__btn--login" to="/login">
          登入/註冊
        </Link>
      </div>
    </div>
  );
};

export default Header;
