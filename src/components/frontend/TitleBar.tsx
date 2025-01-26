import CircleIcon from '@/components/frontend/CircleIcon';
import React from 'react';
import { IconType } from 'react-icons';
import { useNavigate } from 'react-router-dom';

interface TitleBarProps {
  icon: IconType;
  titleText: string;
  moreText?: string;
  showMore?: boolean;
  moreTextClick?: () => void;
  titleClickRoute?: string;
}

const TitleBar: React.FC<TitleBarProps> = ({
  icon: Icon,
  titleText,
  moreText = '',
  showMore = true,
  moreTextClick,
  titleClickRoute,
}) => {
  const navigate = useNavigate();

  const handleTitleClick = () => {
    if (titleClickRoute) {
      navigate(titleClickRoute);
    }
  };

  return (
    <div className="titleBar__title">
      <div className="titleBar__title-icon">
        <CircleIcon icon={Icon} />
      </div>
      <div className="titleBar__title-text" onClick={handleTitleClick}>
        <span className="titleBar__text">{titleText}</span>
      </div>
      {showMore && (
        <div className="titleBar__title-more" onClick={moreTextClick}>
          <span className="titleBar__text">{moreText}</span>
        </div>
      )}
    </div>
  );
};

export default TitleBar;
