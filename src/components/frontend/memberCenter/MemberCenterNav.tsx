import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaUser, FaCoins, FaTrophy, FaReceipt } from 'react-icons/fa';

const navItems = [
  {
    path: '/member-center/profile-edit',
    icon: <FaUser />,
    label: '會員資料修改',
  },
  {
    path: '/member-center/purchase-history',
    icon: <FaCoins />,
    label: '消費紀錄',
  },
  {
    path: '/member-center/rewards',
    icon: <FaTrophy />,
    label: '消費獎勵',
  },
  {
    path: '/member-center/order-history',
    icon: <FaReceipt />,
    label: '訂單記錄',
  },
];

const MemberCenterNav = () => {
  return (
    <div className="memberCenter__nav">
      {navItems.map((item) => (
        <div className="memberCenter__nav-item" key={item.path}>
          <NavLink
            to={item.path}
            className={({ isActive }) =>
              `memberCenter__nav-link ${
                isActive ? 'memberCenter__nav-link--active' : ''
              }`
            }
          >
            <span className="memberCenter__nav-icon">{item.icon}</span>
            <span className="memberCenter__text">{item.label}</span>
          </NavLink>
        </div>
      ))}
    </div>
  );
};

export default MemberCenterNav;
