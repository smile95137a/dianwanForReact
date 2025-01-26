import React from 'react';
import NumberFormatter from '../common/NumberFormatter';
import iconG from '@/assets/image/di-icon-g.png';
import iconS from '@/assets/image/di-icon-s.png';
import iconB from '@/assets/image/di-icon-b.png';
type MoneyCardProps = {
  className: string;
  logoText: string;
  price: string | number;
  suffixText?: string;
};

const MoneyCard: React.FC<MoneyCardProps> = ({
  className,
  logoText,
  price,
  suffixText,
}) => {
  return (
    <div className={`productCard__money ${className}`}>
      <div className="productCard__money-main">
        <div className="productCard__money-logo">
          {logoText === 'G' && <img src={iconG} alt="Gold Icon" />}
          {logoText === 'S' && <img src={iconS} alt="Silver Icon" />}
          {logoText === 'B' && <img src={iconB} alt="Bouns Icon" />}
        </div>
        <div className="productCard__money-price">
          <div className="productCard__money-text">
            <NumberFormatter number={~~price} />
          </div>
        </div>
      </div>
      <div className="productCard__money-text">{suffixText}</div>
    </div>
  );
};

export default MoneyCard;
