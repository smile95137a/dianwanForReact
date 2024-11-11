import React from 'react';
import logoImg from '@/assets/image/logo.png';
import { FaAngleRight, FaToolbox } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { RiShieldStarLine, RiShoppingBagLine } from 'react-icons/ri';
import { IoCartOutline } from 'react-icons/io5';
const Header = () => {
  return (
    <div className="fheader">
      <div className="fheader__logo">
        <Link to={'/main'}>
          <img src={logoImg} className="ffheader__logo-img" />
        </Link>
      </div>

      <div className={'fheader__nav'}>
        <div className="fheader__nav-items">
          <div className="fheader__nav-item fheader__nav-item--logo"></div>
          <Link className="fheader__nav-item" to={'/product'}>
            <div className="fheader__nav-item-icon">
              <RiShieldStarLine />
            </div>
            電玩賞
          </Link>
          <Link className="fheader__nav-item" to={'/mallProduct'}>
            <div className="fheader__nav-item-icon">
              <RiShoppingBagLine />
            </div>
            商城
          </Link>
          <Link className="fheader__nav-item" to={'/product2'}>
            <div className="fheader__nav-item-icon">
              <FaToolbox />
            </div>
            賞品盒
          </Link>
          <Link className="fheader__nav-item" to={'/cart'}>
            <div className="fheader__nav-item-icon">
              <IoCartOutline />
            </div>
            購物車
          </Link>
        </div>
      </div>
      <div className="fheader__btns">
        <Link className="fheader__btn fheader__btn--login" to={'/login'}>
          登入/註冊
        </Link>
      </div>
    </div>
  );
};

export default Header;
