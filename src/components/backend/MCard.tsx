import { FC, ReactNode } from 'react';

interface ICardProps {
  title?: string;
  content: ReactNode;
  customClass?: string;
}

const BCard: FC<ICardProps> = ({ title, content, customClass }) => {
  const cardClass = `bcard ${customClass || ''}`.trim();

  return (
    <div className={cardClass}>
      {title && (
        <div className="bcard__header">
          <p className="bcard__text">{title}</p>
        </div>
      )}
      <div className="bcard__content">{content}</div>
    </div>
  );
};

export default BCard;
