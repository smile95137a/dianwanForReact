import { FC, ReactNode } from 'react';

interface ICardProps {
  title?: string;
  content: ReactNode;
  customClass?: string;
}

const Card: FC<ICardProps> = ({ title, content, customClass }) => {
  const cardClass = `mcard ${customClass || ''}`.trim();

  return (
    <div className={cardClass}>
      {title && (
        <div className="mcard__header">
          <p className="mcard__text">{title}</p>
        </div>
      )}
      <div className="mcard__content">{content}</div>
    </div>
  );
};

export default Card;
