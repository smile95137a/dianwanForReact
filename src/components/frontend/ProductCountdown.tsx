import React, { useEffect, useState } from 'react';
import moment from 'moment';

const ProductCountdown = ({ endTime }: { endTime: string }) => {
  const [countdown, setCountdown] = useState<number>(0);

  useEffect(() => {
    const calculateCountdown = () => {
      const endMoment = moment(endTime);
      const now = moment();
      const duration = endMoment.diff(now, 'seconds');
      setCountdown(duration > 0 ? duration : 0);
    };

    calculateCountdown();

    const intervalId = setInterval(() => {
      calculateCountdown();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [endTime]);

  if (countdown <= 0) {
    return null;
  }

  return (
    <p className="product-detail-one__countdown">
      剩餘時間: {Math.floor(countdown / 60)} 分 {countdown % 60} 秒
    </p>
  );
};

export default ProductCountdown;
