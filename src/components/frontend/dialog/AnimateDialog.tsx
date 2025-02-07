import React, { FC, useEffect, useRef, useState } from 'react';
import Dialog from './Dialog';
import ticketImages from '@/data/ticketImagesData';
import { BsHandIndex } from 'react-icons/bs';
import ticketAnimateImages from '@/data/tickeAnimatetImagesData';
import { getImageUrl } from '@/utils/ImageUtils';
import ProductCountdown from '../ProductCountdown';
import music1 from '@/assets/sounds/iot-music-1.mp3';
import music2 from '@/assets/sounds/iot-music-2.mp3';
import { useLoading } from '@/context/frontend/LoadingContext';
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
  const startX = useRef(0);
  const isScrubbing = useRef(false);
  const audioRef1 = useRef<HTMLAudioElement | null>(null);
  const audioRef2 = useRef<HTMLAudioElement | null>(null);
  const { setLoading } = useLoading();
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [isOpen]);

  useEffect(() => {
    audioRef1.current = new Audio(music1);
    audioRef2.current = new Audio(music2);
    audioRef1.current.preload = 'auto';
    audioRef2.current.preload = 'auto';

    return () => {
      if (audioRef1.current) {
        audioRef1.current.pause();
        audioRef1.current.src = '';
      }
      if (audioRef2.current) {
        audioRef2.current.pause();
        audioRef2.current.src = '';
      }
    };
  }, []);

  const handleMoveUpdate = (e) => {
    if (isScrubbing.current) {
      requestAnimationFrame(() => {
        const currentX = e.clientX;
        if (currentX === 0) return;

        const deltaX = currentX - startX.current;

        if (deltaX > 10) {
          const audio = new Audio(music1);
          audio.preload = 'auto';
          audio.currentTime = 0;
          audio.play().catch(() => {});
          setAnimateIndex((prev) => (prev === null ? 1 : prev + 1));
          startX.current = currentX;
        }
      });
    }
  };

  useEffect(() => {
    if (animateIndex % 4 === 0) {
      console.log(`animateIndex 是 4 的倍數: ${animateIndex}`);
    }
    if (animateIndex === 22) {
      if (audioRef2.current) {
        audioRef2.current.currentTime = 0;
        audioRef2.current
          .play()
          .catch((error) => console.error('播放音效失败:', error));
      }
    }
  }, [animateIndex]);

  const toggleScrubbing = (e) => {
    handleMoveUpdate(e);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX;
    isScrubbing.current = true;
    toggleScrubbing(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMoveUpdate(e);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isScrubbing.current = true;
    toggleScrubbing(e.touches[0]);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMoveUpdate(e.touches[0]);
  };

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

  useEffect(() => {
    const fun = (e) => {
      if (isScrubbing.current) {
        isScrubbing.current = false;
      }
      startX.current = 0;
    };

    document.addEventListener('mouseup', fun);
    document.addEventListener('touchend', fun);
    return () => {
      document.removeEventListener('mouseup', fun);
      document.removeEventListener('touchend', fun);
    };
  }, []);

  useEffect(() => {
    const fun = (e) => {
      if (isScrubbing.current) {
        handleMoveUpdate(e);
      }
    };

    document.addEventListener('mousemove', fun);
    document.addEventListener('touchmove', fun);

    return () => {
      document.removeEventListener('mousemove', fun);
      document.removeEventListener('touchmove', fun);
    };
  }, []);

  const handleImageClick = () => {
    if (animateIndex >= 22) {
      onClose();
    }
  };

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
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >
            <div
              className={`animateDialog__icon ${
                isScrubbing.current ? 'animateDialog--hide' : ''
              }`}
            >
              <BsHandIndex />
            </div>
            <img
              src={finalImageSrc}
              className="animateDialog__img-ticket animateDialog__img-ticket--final"
              onClick={handleImageClick}
            />
            {Object.keys(ticketAnimateImages).map((key, index) => (
              <img
                key={index}
                src={ticketAnimateImages[key]}
                alt={`Animation Frame ${index + 1}`}
                className={`animateDialog__img-animate ${
                  animateIndex === index + 1 ? '' : 'animateDialog__img-hide'
                }`}
              />
            ))}
          </div>
        </div>{' '}
      </div>
    </Dialog>
  );
};

export default AnimateDialog;
