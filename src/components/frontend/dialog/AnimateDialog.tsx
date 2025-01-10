import React, { FC, useCallback, useEffect, useState } from 'react';
import Dialog from './Dialog';
import ticketImages from '@/data/ticketImagesData';
import { BsHandIndex } from 'react-icons/bs';

interface AnimateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  customClass?: string;
  drawData: {
    level: keyof typeof ticketImages;
  };
}

const AnimateDialog: FC<AnimateDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  customClass,
  drawData,
}) => {
  const [animateSrc, setAnimateSrc] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [showFinalImage, setShowFinalImage] = useState(false);
  const [finalImageSrc, setFinalImageSrc] = useState('');
  const [isAnimationStarted, setIsAnimationStarted] = useState(false);

  const [startX, setStartX] = useState(0); // 起始滑鼠位置
  const [isSwiping, setIsSwiping] = useState(false); // 是否正在滑動

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX);
    setIsSwiping(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSwiping) return;
    const deltaX = e.clientX - startX;
    if (deltaX > 100) {
      handleStartAnimation();
      setIsSwiping(false); // 防止重複觸發
    }
  };

  const handleMouseUp = () => {
    setIsSwiping(false);
  };

  const onGifLoad = useCallback(() => {
    const duration = 2000;
    setShowFinalImage(true);
    setTimeout(() => {
      handleGifComplete();
    }, duration);
  }, []);

  const handleGifComplete = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleStartAnimation = useCallback(() => {
    if (isAnimationStarted) return;
    setAnimateSrc(ticketImages.kujiAnime);
    setTimestamp(Date.now().toString());
    setIsAnimationStarted(true);
  }, [isAnimationStarted]);

  useEffect(() => {
    const gradeKey =
      typeof drawData.level === 'string' &&
      ticketImages[drawData.level.toUpperCase() as keyof typeof ticketImages]
        ? (drawData.level.toUpperCase() as keyof typeof ticketImages)
        : '';

    setFinalImageSrc(gradeKey ? ticketImages[gradeKey] : '');
  }, [drawData]);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      className={`dialog--animate ${customClass}`}
    >
      <div
        className="animateDialog"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp} // 防止滑鼠移出區域時未觸發 MouseUp
      >
        <div className="animateDialog__img">
          <img
            src={ticketImages.BLANK}
            alt="Final Result"
            className={`animateDialog__img-ticket animateDialog__img-ticket--blank ${
              isAnimationStarted ? 'animateDialog--hide' : ''
            }`}
          />
          <div
            className={`animateDialog__icon ${
              isAnimationStarted ? 'animateDialog--hide' : ''
            }`}
          >
            <BsHandIndex />
          </div>
          <img
            src={finalImageSrc}
            className="animateDialog__img-ticket animateDialog__img-ticket--final"
          />
          <img
            src={`${animateSrc}?t=${timestamp}`}
            onLoad={onGifLoad}
            alt="Animation"
            className="animateDialog__img-animate"
          />
        </div>
      </div>
    </Dialog>
  );
};

export default AnimateDialog;
