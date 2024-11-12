import CircleIcon from '@/components/frontend/CircleIcon';
import React from 'react';
import { IconType } from 'react-icons';

interface TitleBarProps {
  icon: IconType;
  titleText: string;
  moreText?: string;
  showMore?: boolean;
}

const TitleBar: React.FC<TitleBarProps> = ({
  icon: Icon,
  titleText,
  moreText = '',
  showMore = true,
}) => {
  return (
    <div className="titleBar__title">
      <div className="titleBar__title-icon">
        <CircleIcon icon={Icon} />
      </div>
      <div className="titleBar__title-text">
        <span className="titleBar__text">{titleText}</span>
      </div>
      {showMore && (
        <div className="titleBar__title-more">
          <span className="titleBar__text">{moreText}</span>
        </div>
      )}
    </div>
  );
};

export default TitleBar;
