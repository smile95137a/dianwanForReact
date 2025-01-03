import React, { FC, useCallback, useEffect, useState } from 'react';
import Dialog from './Dialog';
import ticketImages from '@/data/ticketImagesData';

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

  useEffect(() => {
    setAnimateSrc(ticketImages.kujiAnime);
    setTimestamp(Date.now().toString());

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
      <div className="animateDialog">
        <div className="animateDialog__img">
          {showFinalImage && finalImageSrc && (
            <img
              src={finalImageSrc}
              alt="Final Result"
              className="animateDialog__img-ticket"
            />
          )}
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
