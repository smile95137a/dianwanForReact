import NumberFormatter from '@/components/common/NumberFormatter';
import { getUserInfo } from '@/services/frontend/userService';
import React, { useEffect, useState } from 'react';
import { FaDollarSign, FaGift } from 'react-icons/fa';

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
        <div className="memberCenter__coins-item">
          <div className="memberCenter__coins-icon">
            <FaDollarSign />
          </div>
          <div className="memberCenter__coins-info">
            <div className="memberCenter__coins-title">
              <p className="memberCenter__text">儲值</p>
            </div>
            <div className="memberCenter__coins-num">
              <p className="memberCenter__text">
                <NumberFormatter number={userBalance} />
              </p>
            </div>
          </div>
        </div>

        <div className="memberCenter__coins-item">
          <div className="memberCenter__coins-icon">
            <FaGift />
          </div>
          <div className="memberCenter__coins-info">
            <div className="memberCenter__coins-title">
              <p className="memberCenter__text">紅利點數</p>
            </div>
            <div className="memberCenter__coins-num">
              <p className="memberCenter__text">
                <NumberFormatter number={userBonus} />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberCenterCoins;
