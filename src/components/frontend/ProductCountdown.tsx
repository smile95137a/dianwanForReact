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
      保護還有{' '}
      <span className="product-detail-one__text product-detail-one__text--red">
        {countdown}
      </span>
      秒
    </p>
  );
};

export default ProductCountdown;
