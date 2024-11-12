import React, { ReactNode } from 'react';

interface ICardProps {
  customClass?: string;
  title?: string;
  children?: ReactNode;
}

const Card: React.FC<ICardProps> = ({ customClass = '', title, children }) => {
  const cardClass = `mcard ${customClass}`.trim();

  return (
    <div className={cardClass}>
      {title && (
        <div className="mcard__header">
          <p className="mcard__text">{title}</p>
        </div>
      )}
      <div className="mcard__content">{children}</div>
    </div>
  );
};

export default Card;
