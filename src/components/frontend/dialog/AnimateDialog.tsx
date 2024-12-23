import React, { FC, useCallback, useEffect, useState } from 'react';
import Dialog from './Dialog';
import ticketAnimate from '@/assets/image/kuji_animation.gif';
import testA from '@/assets/image/test.gif';
import testAP from '@/assets/image/kuji_ticket.png';

interface AnimateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  customClass?: string;
  drawData: any;
}

const gifDuration = {
  box: 1000,
  ticket: 1000,
  gacha: 2000,
};

const AnimateDialog: FC<AnimateDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  customClass,
  drawData,
}) => {
  const [animateSrc, setAnimateSrc] = useState('');
  const [animate2Src, setAnimate2Src] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [showFinalImage, setShowFinalImage] = useState(false);

  const onGifLoad = useCallback(() => {
    const duration = 2000;
    setShowFinalImage(true);
    setTimeout(() => {
      handleGifComplete();
    }, duration);
  }, []);

  // 处理 GIF 动画完成后关闭对话框
  const handleGifComplete = useCallback(() => {
    onClose();
  }, []);

  // 当对话框打开时，更新动画资源和时间戳
  useEffect(() => {
    setAnimateSrc(ticketAnimate);
    setAnimate2Src(testA);
    setTimestamp(Date.now().toString());
  }, []);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      className={`dialog--animate ${customClass}`}
    >
      <div className="animateDialog">
        {/* <img
          src={`${animateSrc}?t=${timestamp}`}
          onLoad={onGifLoad}
          className="animateDialog__img"
        /> */}
        <div className="animateDialog__img">
          {showFinalImage && (
            <img src={testAP} className="animateDialog__img-ticket" />
          )}
          <img
            src={`${animate2Src}?t=${timestamp}`}
            onLoad={onGifLoad}
            className="animateDialog__img-animate"
          />
        </div>
      </div>
    </Dialog>
  );
};

export default AnimateDialog;
