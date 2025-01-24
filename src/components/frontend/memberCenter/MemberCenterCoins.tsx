import NumberFormatter from '@/components/common/NumberFormatter';
import { getUserInfo } from '@/services/frontend/userService';
import React, { useEffect, useState } from 'react';
import { FaDollarSign, FaGift } from 'react-icons/fa';
import iconG from '@/assets/image/di-icon-g.png';
import iconS from '@/assets/image/di-icon-s.png';
const MemberCenterCoins = () => {
  const [userBalance, setUserBalance] = useState(0);
  const [userBonus, setUserBonus] = useState(0);
  const [userSliver, setUserSliver] = useState(0);

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
    } catch (error) {
      console.error('獲取用戶信息時發生錯誤：', error.message || '請稍後再試');
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <div>
      <div className="memberCenter__coins">
        <div className="memberCenter__coins-item memberCenter__coins-item--gold">
          <div className="memberCenter__coins-info">
            <div className="memberCenter__coins-icon">
              <img src={iconG} alt="Gold Icon" />
            </div>
            <div className="memberCenter__coins-title">
              <p className="memberCenter__text">代幣</p>
            </div>
          </div>
          <div className="memberCenter__coins-num">
            <p className="memberCenter__text">
              <NumberFormatter number={userBalance} />
            </p>
          </div>
        </div>
        <div className="memberCenter__coins-item memberCenter__coins-item--sliver">
          <div className="memberCenter__coins-info">
            <div className="memberCenter__coins-icon">
              <img src={iconS} alt="Silver Icon" />
            </div>
            <div className="memberCenter__coins-title">
              <p className="memberCenter__text">點數</p>
            </div>
          </div>
          <div className="memberCenter__coins-num">
            <p className="memberCenter__text">
              <NumberFormatter number={userSliver} />
            </p>
          </div>
        </div>
        <div className="memberCenter__coins-item memberCenter__coins-item--bonus">
          <div className="memberCenter__coins-info">
            <div className="memberCenter__coins-icon">利</div>
            <div className="memberCenter__coins-title">
              <p className="memberCenter__text">紅利</p>
            </div>
          </div>
          <div className="memberCenter__coins-num">
            <p className="memberCenter__text">
              <NumberFormatter number={userBonus} />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberCenterCoins;
