import React, { FC } from 'react';
import Dialog from './Dialog';
import NumberFormatter from '@/components/common/NumberFormatter';
import { getImageUrl } from '@/utils/ImageUtils';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
interface NewsBannerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  customClass?: string;
  newsBannerData: any;
}

const NewsBannerDialog: FC<NewsBannerDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  customClass,
  newsBannerData,
}) => {
  const navigate = useNavigate();

  const goToNews = (news: any) => {
    navigate(`/news/${news.newsUid}`);
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      className={`dialog--newsBanner ${customClass}`}
    >
      <div className="newsBannerDialog">
        <div className="news-banner-slider">
          <Swiper
            slidesPerView={1}
            navigation
            modules={[Navigation]}
            className="newsBanner__swiper"
          >
            {newsBannerData.map((news, index) => (
              <SwiperSlide key={index} onClick={() => goToNews(news)}>
                <div className="news-banner-slider__item">
                  {Array.isArray(news?.imageUrls) &&
                    news.imageUrls.length > 0 && (
                      <img
                        src={getImageUrl(news.imageUrls[0])}
                        alt="圖片"
                        className="news-banner-slider__item-img"
                      />
                    )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </Dialog>
  );
};

export default NewsBannerDialog;
