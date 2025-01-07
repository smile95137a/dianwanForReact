import React, { useEffect, useRef, useState } from 'react';
import logoImg from '@/assets/image/logo.png';
import { Link } from 'react-router-dom';
import {
  RiAwardLine,
  RiShieldStarLine,
  RiShoppingBagLine,
  RiSmartphoneLine,
  RiUserLine,
} from 'react-icons/ri';
import { IoCartOutline } from 'react-icons/io5';
import {
  FaBullhorn,
  FaCog,
  FaBars,
  FaUserCircle,
  FaGift,
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { clearAuthData } from '@/store/slices/frontend/authSlice';
import moment from 'moment';
import { getAllMarquees } from '@/services/frontend/marqueeService';
import SocialLinks from '../common/SocialLinks';
import { toggleSidebar } from '@/store/slices/frontend/uiSlice';
import DropdownMenu from '../common/DropdownMenu';
import { getUserInfo } from '@/services/frontend/userService';
import NumberFormatter from '../common/NumberFormatter';

const navItems = [
  {
    to: '/gamePrize',
    icon: <RiShieldStarLine />,
    label: '電玩賞',
    class: 'blue',
  },
  {
    to: '/3cPrize',
    icon: <RiSmartphoneLine />,
    label: '3C賞',
    class: 'blue',
  },
  {
    to: '/redPrize',
    icon: <RiAwardLine />,
    label: '紅利賞',
    class: 'blue',
  },
  {
    to: '/discountPrize',
    icon: <FaCog />,
    label: '優惠賞',
    class: 'red',
  },
  {
    to: '/news',
    icon: <FaBullhorn />,
    label: '最新消息',
    class: 'red',
  },
  {
    to: '/mallProduct',
    icon: <RiShoppingBagLine />,
    label: '商城',
    class: 'orange',
  },
  {
    to: '/cart',
    icon: <IoCartOutline />,
    label: '購物車',
    class: 'orange',
  },
];

const Header = () => {
  const [userBalance, setUserBalance] = useState(0);
  const [userBonus, setUserBonus] = useState(0);
  const [userSliver, setUserSliver] = useState(0);

  const dispatch = useDispatch();
  const isLogin = useSelector(
    (state: RootState) => state.frontend.auth.isLogin
  );

  const siddeBarIsOpen = useSelector(
    (state: RootState) => state.frontend.ui.sidebarOpen
  );

  const handleLogout = () => {
    dispatch(clearAuthData());
  };

  const handleToggle = () => {
    dispatch(toggleSidebar());
  };

  const fetchUserInfo = async () => {
    try {
      const response = await getUserInfo();
      const { success, data, message } = response;

      if (success) {
        setUserBalance(data.balance || 0);
        setUserBonus(data.bonus || 0);
        setUserSliver(data.sliverCoin || 0);
      } else {
        console.error(`獲取用戶信息失敗：${message || '未知錯誤'}`);
      }
    } catch (error: any) {
      console.error('獲取用戶信息時發生錯誤：', error.message || '請稍後再試');
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <div className="fheader">
      <div className="fheader__main">
        <div className="fheader__logo">
          <Link to="/main">
            <img src={logoImg} className="ffheader__logo-img" alt="Logo" />
          </Link>
        </div>
        <div className="fheader__menu" onClick={handleToggle}>
          <FaBars />
        </div>

        <div className="fheader__socials">
          <SocialLinks />
        </div>

        <div
          className={`fheader__nav ${
            siddeBarIsOpen ? 'fheader__nav--open' : ''
          }`}
          onClick={handleToggle}
        >
          <div className="fheader__nav-items">
            {navItems.map((item, index) => (
              <Link
                key={index}
                className={`fheader__nav-item fheader__nav-item--${item.class}`}
                to={item.to}
              >
                <div
                  className={`fheader__nav-item-icon fheader__nav-item-icon--${item.class}`}
                >
                  {item.icon}
                </div>
                {item.label}
              </Link>
            ))}

            {isLogin && (
              <>
                <div className="fheader__nav-item-divider"></div>
                <div className="fheader__nav-item fheader__nav-item--gold">
                  <div className="fheader__nav-item-icon">G</div>
                  <NumberFormatter number={userBalance} />
                </div>
                <div className="fheader__nav-item fheader__nav-item--sliver">
                  <div className="fheader__nav-item-icon">S</div>
                  <NumberFormatter number={userSliver} />
                </div>
                <div className="fheader__nav-item fheader__nav-item--bonus">
                  <div className="fheader__nav-item-icon">利</div>
                  <NumberFormatter number={userBonus} />
                </div>
                <Link
                  className="fheader__nav-item fheader__nav-item--member"
                  to="/member-center"
                >
                  <div className="fheader__nav-item-icon">
                    <RiUserLine />
                  </div>
                  會員中心
                </Link>
                <Link
                  className="fheader__nav-item fheader__nav-item--box"
                  to="/member-center"
                >
                  <div className="fheader__nav-item-icon">
                    <FaGift />
                  </div>
                  賞品盒
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="fheader__btns">
          {!isLogin ? (
            <Link className="fheader__btn fheader__btn--login" to="/login">
              登入/註冊
            </Link>
          ) : (
            <>
              <DropdownMenu
                coins={[
                  {
                    label: 'Gold Coins',
                    icon: 'G',
                    link: '#',
                    coins: userBalance,
                    className: 'gold',
                  },
                  {
                    label: 'Silver Coins',
                    icon: 'S',
                    link: '#',
                    coins: userSliver,
                    className: 'sliver',
                  },
                  {
                    label: 'Bonus Points',
                    icon: '利',
                    link: '#',
                    coins: userBonus,
                    className: 'bonus',
                  },
                ]}
                links={[
                  {
                    label: '會員中心',
                    link: '/member-center',
                    className: 'custom-class-1',
                    icon: <FaUserCircle />,
                  },
                  {
                    label: '賞品盒子',
                    link: '/prize-box',
                    className: 'custom-class-2',
                    icon: <FaGift />,
                  },
                ]}
                className="header"
                icon={<FaUserCircle />}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
