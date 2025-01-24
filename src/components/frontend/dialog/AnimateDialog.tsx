import React, { FC, useCallback, useEffect, useState } from 'react';
import Dialog from './Dialog';
import ticketImages from '@/data/ticketImagesData';
import { BsHandIndex } from 'react-icons/bs';
import ticketAnimateImages from '@/data/tickeAnimatetImagesData';
import { getImageUrl } from '@/utils/ImageUtils';
import ProductCountdown from '../ProductCountdown';

interface AnimateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  customClass?: string;
  drawData: any;
}

const AnimateDialog: FC<AnimateDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  customClass,
  drawData,
}) => {
  const [animateIndex, setAnimateIndex] = useState(1);
  const [finalImageSrc, setFinalImageSrc] = useState('');
  const [startX, setStartX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [baseIndex, setBaseIndex] = useState(1);

  const handleStart = (x: number) => {
    setStartX(x);
    setIsSwiping(true);
  };

  const handleMove = (x: number) => {
    if (!isSwiping) return;

    const deltaX = x - startX;
    const newIndex = Math.min(
      Math.max(1, baseIndex + Math.floor(deltaX / 5)),
      24
    );

    if (newIndex !== animateIndex) {
      setAnimateIndex(newIndex);
    }

    if (newIndex === 24) {
      setIsSwiping(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  };

  const handleEnd = () => {
    setIsSwiping(false);
    setBaseIndex(animateIndex); // 将当前索引作为新的起点
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = handleEnd;
  const handleMouseUp = handleEnd;

  useEffect(() => {
    const gradeKey =
      typeof drawData.item.level === 'string' &&
      ticketImages[
        drawData.item.level.toUpperCase() as keyof typeof ticketImages
      ]
        ? (drawData.item.level.toUpperCase() as keyof typeof ticketImages)
        : '';

    setFinalImageSrc(gradeKey ? ticketImages[gradeKey] : '');
  }, [drawData.item]);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      className={`dialog--animate ${customClass}`}
    >
      <div className="animateDialog">
        <div className="animateDialog__bg">
          <img
            src={getImageUrl(drawData.drawData.product.imageUrls[0])}
            alt=""
          />
        </div>
        <div className="animateDialog__infos">
          <div className="animateDialog__info animateDialog__info--title">
            <p className="animateDialog__text animateDialog__text--title">
              {drawData.drawData.product.productName}
            </p>
          </div>
          <div className="animateDialog__info animateDialog__info--sub">
            <p className="animateDialog__text">
              剩餘{drawData.totalLength - drawData.index}張獎籤
            </p>
            {drawData.endTimes && (
              <ProductCountdown endTime={drawData.endTimes} />
            )}
          </div>
        </div>
        <div className="animateDialog__imgs">
          <div
            className="animateDialog__img"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className={`animateDialog__icon ${
                isSwiping ? 'animateDialog--hide' : ''
              }`}
            >
              <BsHandIndex />
            </div>
            <img
              src={finalImageSrc}
              className="animateDialog__img-ticket animateDialog__img-ticket--final"
            />
            <img
              src={ticketAnimateImages[`kujiAnimate${animateIndex}`]}
              alt={`Animation Frame ${animateIndex}`}
              className="animateDialog__img-animate"
            />
          </div>
        </div>{' '}
      </div>
    </Dialog>
  );
};

export default AnimateDialog;
