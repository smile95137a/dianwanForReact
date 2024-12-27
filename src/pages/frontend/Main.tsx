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

const Main = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [mallProducts, setMallProducts] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const { setLoading } = useLoading();

  const redirectToProductPage = () => {
    navigate('/product');
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
        setProducts(allProductList.data);
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

  const handleProductClick = (productId) => () => {
    navigate(`/product/${productId}`);
  };

  return (
    <>
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

      <div className="fhome">
        <TitleBar
          icon={BsHandbag}
          titleText="電玩賞"
          moreText="更多"
          moreTextClick={redirectToProductPage}
        />
        <div className="fhome__list">
          {products.length > 0 ? (
            products
              .slice(0, 6)
              .map((product, index) => (
                <ProductCard
                  key={genRandom(24)}
                  product={product}
                  className="prouctCard--mall"
                />
              ))
          ) : (
            <>
              <NoData />
            </>
          )}
        </div>

        <TitleBar
          icon={BsHandbag}
          titleText="商城"
          moreText="更多"
          moreTextClick={redirectToMallPage}
        />

        <div className="fhome__list">
          {mallProducts.length > 0 ? (
            mallProducts
              .slice(0, 6)
              .map((product, index) => (
                <ProductCard
                  key={genRandom(24)}
                  product={product}
                  isMall={true}
                  className="productCard--mall"
                />
              ))
          ) : (
            <>
              <NoData />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Main;
