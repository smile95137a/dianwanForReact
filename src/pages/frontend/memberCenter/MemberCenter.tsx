import MCard from '@/components/frontend/MCard';
import MemberCenterNav from '@/components/frontend/memberCenter/MemberCenterNav';
import React from 'react';
import { Outlet } from 'react-router-dom';

const MemberCenter = () => {
  return (
    <div className="memberCenter">
      <MemberCenterNav />
      <div className="memberCenter__main">
        <MCard customClass="mcard--memberCenter" title="會員中心">
          <Outlet />
        </MCard>
      </div>
    </div>
  );
};

export default MemberCenter;
