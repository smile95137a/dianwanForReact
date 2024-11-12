import NumberFormatter from '@/components/common/NumberFormatter';
import React from 'react';
import { FaDollarSign, FaGift } from 'react-icons/fa';

const MemberCenterCoins = () => {
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
                <NumberFormatter number={10000000} />
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
                <NumberFormatter number={10000000} />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberCenterCoins;
