import React from 'react';
import NumberFormatter from '../common/NumberFormatter';

type MoneyCardProps = {
  className: string;
  logoText: string;
  price: string | number;
};

const MoneyCard: React.FC<MoneyCardProps> = ({
  className,
  logoText,
  price,
}) => {
  return (
    <div className={`productCard__money ${className}`}>
      <div className="productCard__money-main">
        <div className="productCard__money-logo">
          <div className="productCard__money-text">{logoText}</div>
        </div>
        <div className="productCard__money-price">
          <div className="productCard__money-text">
            <NumberFormatter number={~~price} />
          </div>
        </div>
      </div>
      <div className="productCard__money-text">/抽</div>
    </div>
  );
};

export default MoneyCard;
