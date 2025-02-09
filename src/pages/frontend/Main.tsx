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
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { getPagedStoreProducts } from '@/services/frontend/storeProductService';
import NoData from '@/components/frontend/NoData';
import { useLoading } from '@/context/frontend/LoadingContext';
import { getAllBanners } from '@/services/frontend/bannerService';
import { genRandom } from '@/utils/RandomUtils';
import Marquee from '@/components/frontend/Marquee';
import { PrizeCategory } from '@/interfaces/product';
import { FaAngleRight } from 'react-icons/fa6';
import { getDisplayNews } from '@/services/frontend/newsService';
import { useFrontendDialog } from '@/context/frontend/useFrontedDialog';
import moment from 'moment';

const Main = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState<any[]>([]);

  const [figureProducts, setFigureProducts] = useState<IProduct[]>([]);
  const [c3Products, setC3Products] = useState<IProduct[]>([]);
  const [bonusProducts, setBonusProducts] = useState<IProduct[]>([]);

  const [mallProducts, setMallProducts] = useState<any[]>([]);
  const { setLoading } = useLoading();
  const { openNewsBannerDialog } = useFrontendDialog();

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
          (p) =>
            p.status === 'AVAILABLE' && p.prizeCategory === PrizeCategory.FIGURE
        );
        const c3s = allProducts.filter(
          (p) =>
            p.status === 'AVAILABLE' && p.prizeCategory === PrizeCategory.C3
        );
        const bonuses = allProducts.filter(
          (p) =>
            p.status === 'AVAILABLE' && p.prizeCategory === PrizeCategory.BONUS
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
    fetchDisplayNews();
  }, []);

  const fetchDisplayNews = async () => {
    try {
      const localStorageKey = 'newsDisplayed';
      const timestampKey = 'newsDisplayedTimestamp';
      const currentTime = moment(); // 當前時間使用 moment.js

      // 從 localStorage 取出儲存的時間戳
      const savedTimestamp = localStorage.getItem(timestampKey);
      if (
        savedTimestamp &&
        currentTime.diff(moment(savedTimestamp), 'days') >= 1
      ) {
        // 如果超過一天，自動清除 localStorage
        localStorage.removeItem(localStorageKey);
        localStorage.removeItem(timestampKey);
      }

      const isNewsDisplayed = localStorage.getItem(localStorageKey);

      if (!isNewsDisplayed) {
        const { success, message, data } = await getDisplayNews();
        if (success) {
          if (data.length > 0) {
            openNewsBannerDialog(data);

            // 將標記和時間戳存入 localStorage
            localStorage.setItem(localStorageKey, 'true');
            localStorage.setItem(timestampKey, moment().toISOString()); // 儲存 ISO 格式時間
          }
        } else {
          console.log(message);
        }
      }
    } catch (error) {
      console.error('Error fetching display news:', error);
    }
  };

  const goToProductDetail = (banner: any) => {
    if (banner && banner.productId) {
      navigate(`/product/${banner.productId}`);
    }
  };

  return (
    <>
      {banners.length > 0 && (
        <div className="slider">
          <Swiper
            slidesPerView={1}
            spaceBetween={10}
            navigation
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            modules={[Navigation, Pagination, Autoplay]}
            loop={true}
            className="mySwiper"
            breakpoints={{
              768: { slidesPerView: 3 },
            }}
          >
            {banners.map((banner, index) => (
              <SwiperSlide
                key={index}
                onClick={() => goToProductDetail(banner)}
              >
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
      )}{' '}
      <div className="fhome">
        <Marquee />

        <TitleBar
          icon={BsHandbag}
          titleText="電玩賞"
          titleClickRoute="/gamePrize"
        />
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

        <TitleBar
          icon={BsHandbag}
          titleText="3C賞"
          titleClickRoute="/3cPrize"
        />

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

        <TitleBar
          icon={BsHandbag}
          titleText="商城"
          titleClickRoute="/mallProduct"
        />

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
        <TitleBar
          icon={BsHandbag}
          titleText="紅利賞"
          titleClickRoute="/redPrize"
        />

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
    </>
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
