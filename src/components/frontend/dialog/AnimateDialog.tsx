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
    const loadAudio = async () => {
      const audio1 = new Audio(music1);
      const audio2 = new Audio(music2);

      audioRef1.current = audio1;
      audioRef2.current = audio2;

      const loadPromise1 = new Promise<void>((resolve) => {
        audio1.addEventListener('canplaythrough', () => resolve(), {
          once: true,
        });
      });

      const loadPromise2 = new Promise<void>((resolve) => {
        audio2.addEventListener('canplaythrough', () => resolve(), {
          once: true,
        });
      });
      setLoading(true);
      await Promise.all([loadPromise1, loadPromise2]);
      setLoading(false);
    };

    loadAudio();
  }, []);

  const handleMoveUpdate = (e) => {
    if (isScrubbing.current) {
      requestAnimationFrame(() => {
        const currentX = e.clientX;
        if (currentX === 0) return;

        const deltaX = currentX - startX.current;
        if (audioRef1.current) {
          audioRef1.current.currentTime = 0;
          audioRef1.current
            .play()
            .catch((error) => console.error('播放音效失败:', error));
        }
        if (deltaX > 10) {
          setAnimateIndex((prev) => (prev === null ? 1 : prev + 1));
          startX.current = currentX;
        }
      });
    }
  };

  useEffect(() => {
    if (animateIndex >= 22) {
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
    if (animateIndex >= 16) {
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
