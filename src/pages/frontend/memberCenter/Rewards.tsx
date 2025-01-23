import React, { useState, useEffect } from 'react';
import MemberCenterCoins from '@/components/frontend/memberCenter/MemberCenterCoins';
import NumberFormatter from '@/components/common/NumberFormatter';
import { useLoading } from '@/context/frontend/LoadingContext';
import { getTotalConsumeAmount } from '@/services/frontend/paymentService';

const Rewards: React.FC = () => {
  const [cumulative, setCumulative] = useState(0);
  const [rewards, setRewards] = useState<any[]>([]);
  const { setLoading } = useLoading();

  const fetchTotalAmount = async () => {
    try {
      setLoading(true);
      const { success, data, message } = await getTotalConsumeAmount();
      setLoading(false);

      if (success) {
        setCumulative(data.cumulative);
        setRewards(data.rewardStatusList);
      } else {
        console.error(message);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching total consume amount:', error);
    }
  };

  useEffect(() => {
    fetchTotalAmount();
  }, []);

  return (
    <div className="memberCenter__rewards">
      <MemberCenterCoins />

      <div className="memberCenter__rewardsConsume">
        <div className="memberCenter__rewardsConsume-title">
          <p className="memberCenter__text">消費獎勵</p>
        </div>
        <div className="memberCenter__rewardsConsume-subTitle">
          儲值獎勵計算方式
        </div>
        <div className="memberCenter__rewardsConsume-info">
          <p>每月1號~31號期間累計儲值金額達到累計的標準即可領取獎勵！</p>
          <p>每月1號將重新開始計算。</p>
          <p>
            一抽券面額50元，可以累積使用於商品免費一抽！(不限店家，效期三個月)
          </p>
        </div>
      </div>

      <div className="memberCenter__rewardsAccount">
        <p className="memberCenter__text">
          本月累計金額：
          <span className="memberCenter__text memberCenter__text--red">
            $ <NumberFormatter number={cumulative} />
          </span>
        </p>
      </div>

      <div className="memberCenter__rewardsCoins">
        {rewards.map((reward, index) => (
          <div className="memberCenter__rewardsCoins-item" key={index}>
            <div className="memberCenter__rewardsCoins-icon">
              {/* <img src={c1} alt="Reward Icon" /> */}
            </div>

            <div className="memberCenter__rewardsCoins-title">
              <p className="memberCenter__text">
                累計滿
                <span className="memberCenter__text memberCenter__text--red">
                  <NumberFormatter number={reward.threshold} /> 元
                </span>
              </p>
            </div>

            <div className="memberCenter__rewardsCoins-subTitle">
              <p className="memberCenter__text">
                領取
                <span className="memberCenter__text memberCenter__text--red">
                  <NumberFormatter number={reward.sliver} /> 銀幣
                </span>
              </p>
            </div>

            <div className="memberCenter__rewardsCoins-btns">
              <div className="memberCenter__rewardsCoins-btn">
                {reward.achieved ? '已達標' : '未達標'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rewards;
