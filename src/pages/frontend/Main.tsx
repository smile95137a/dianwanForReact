import ProductCard from '@/components/frontend/ProductCard';
import {
  getAllProductList,
  IProduct,
} from '@/services/frontend/productService';
import { getImageUrl } from '@/utils/ImageUtils';
import React, { useEffect, useState } from 'react';
import { BsHandbag } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import TitleBar from '../../components/frontend/TitleBar';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { getPagedStoreProducts } from '@/services/frontend/storeProductService';
import NoData from '@/components/frontend/NoData';
import { useLoading } from '@/context/frontend/LoadingContext';
import { getAllBanners } from '@/services/frontend/bannerService';
import { genRandom } from '@/utils/RandomUtils';
import Marquee from '@/components/frontend/Marquee';
import { PrizeCategory } from '@/interfaces/product';
import { FaAngleRight } from 'react-icons/fa6';
const Main = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState<any[]>([]);

  const [figureProducts, setFigureProducts] = useState<IProduct[]>([]);
  const [c3Products, setC3Products] = useState<IProduct[]>([]);
  const [bonusProducts, setBonusProducts] = useState<IProduct[]>([]);

  const [mallProducts, setMallProducts] = useState<any[]>([]);
  const { setLoading } = useLoading();
  const redirectToCategoryPage = (category: PrizeCategory) => {
    if (category === PrizeCategory.FIGURE) {
      navigate(`/gamePrize`);
    } else if (category === PrizeCategory.C3) {
      navigate(`/3cPrize`);
    } else if (category === PrizeCategory.BONUS) {
      navigate(`redPrize`);
    }
  };

  const redirectToMallPage = () => {
    navigate('/mallProduct');
  };

  const loadMainData = async () => {
    try {
      setLoading(true);
      const allProductList = await getAllProductList();
      const pagedStoreProducts = await getPagedStoreProducts(0, 200);
      const bannerData = await getAllBanners();
      setLoading(false);

      if (allProductList.success) {
        const allProducts = allProductList.data;
        const figures = allProducts.filter(
          (p) => p.prizeCategory === PrizeCategory.FIGURE
        );
        const c3s = allProducts.filter(
          (p) => p.prizeCategory === PrizeCategory.C3
        );
        const bonuses = allProducts.filter(
          (p) => p.prizeCategory === PrizeCategory.BONUS
        );

        setFigureProducts(figures);
        setC3Products(c3s);
        setBonusProducts(bonuses);
      } else {
        console.error('獲取全部產品失敗:', allProductList.message);
      }

      if (pagedStoreProducts.success) {
        setMallProducts(pagedStoreProducts.data);
      } else {
        console.error('獲取商城產品失敗:', pagedStoreProducts.message);
      }

      if (bannerData.success) {
        setBanners(bannerData.data);
      } else {
        console.error('獲取橫幅資料失敗:', bannerData.message);
      }
    } catch (err) {
      setLoading(false);
      console.error('Error loading main data:', err);
    }
  };

  useEffect(() => {
    loadMainData();
  }, []);

  return (
    <div className="fhome">
      {banners.length > 0 && (
        <div className="slider">
          <Swiper
            slidesPerView={1}
            centeredSlides={true}
            spaceBetween={30}
            navigation
            modules={[Navigation]}
            loop={true}
            className="mySwiper"
            breakpoints={{
              768: { slidesPerView: 3 },
            }}
          >
            {banners.map((banner, index) => (
              <SwiperSlide key={index}>
                <div className="slider__item">
                  {Array.isArray(banner?.imageUrls) &&
                    banner.imageUrls.length > 0 && (
                      <img
                        src={getImageUrl(banner.imageUrls[0])}
                        alt="圖片"
                        className="slider__item-img"
                      />
                    )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      <Marquee />

      <TitleBar icon={BsHandbag} titleText="電玩賞" />
      {figureProducts.length > 0 ? (
        <>
          <div className="fhome__list">
            {figureProducts.slice(0, 6).map((product) => (
              <ProductCard key={genRandom(24)} product={product} />
            ))}
          </div>
          <MoreButton
            onClick={() => redirectToCategoryPage(PrizeCategory.FIGURE)}
          />
        </>
      ) : (
        <>
          <NoData text="查無資料！" />
        </>
      )}

      <TitleBar icon={BsHandbag} titleText="3C賞" />

      {c3Products.length > 0 ? (
        <>
          <div className="fhome__list">
            {c3Products.slice(0, 6).map((product) => (
              <ProductCard key={genRandom(24)} product={product} />
            ))}
          </div>
          <MoreButton
            onClick={() => redirectToCategoryPage(PrizeCategory.C3)}
          />
        </>
      ) : (
        <>
          <NoData text="查無資料！" />
        </>
      )}

      <TitleBar icon={BsHandbag} titleText="商城" />

      {mallProducts.length > 0 ? (
        <>
          <div className="fhome__list">
            {mallProducts.slice(0, 6).map((product) => (
              <ProductCard
                key={genRandom(24)}
                product={product}
                isMall={true}
                className="productCard--mall"
              />
            ))}
          </div>
          <MoreButton onClick={redirectToMallPage} />
        </>
      ) : (
        <>
          <NoData text="查無資料！" />
        </>
      )}
      <TitleBar icon={BsHandbag} titleText="紅利賞" />

      {bonusProducts.length > 0 ? (
        <>
          <div className="fhome__list">
            {bonusProducts.slice(0, 6).map((product) => (
              <ProductCard key={genRandom(24)} product={product} />
            ))}
          </div>
          <MoreButton
            onClick={() => redirectToCategoryPage(PrizeCategory.BONUS)}
          />
        </>
      ) : (
        <>
          <NoData text="查無資料！" />
        </>
      )}
    </div>
  );
};

export default Main;

interface MoreButtonProps {
  onClick: () => void;
  text?: string;
}

const MoreButton: React.FC<MoreButtonProps> = ({ onClick, text = '更多' }) => {
  return (
    <div className="fhome__more">
      <button onClick={onClick} className="fhome__more-btn">
        {text}
        <div className="fhome__more-icon">
          <FaAngleRight />
        </div>
      </button>
    </div>
  );
};
