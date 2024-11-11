import CircleIcon from '@/components/frontend/CircleIcon';
import ProductCard from '@/components/frontend/ProductCard';
import {
  getAllProductList,
  IProduct,
} from '@/services/frontend/productService';
import { getImageUrl } from '@/utils/ImageUtils';
import React, { useEffect, useState } from 'react';
import { BsHandbag } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import TitleBar from './TitleBar';
import bg from '@/assets/image/bg1.jpeg';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa';
import { getPagedStoreProducts } from '@/services/frontend/storeProductService';
import NoData from '@/components/frontend/NoData';

const Main = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [mallProducts, setMallProducts] = useState<any[]>([]);

  const fetchProducts = async () => {
    try {
      const allProductList = await getAllProductList();
      const pagedStoreProducts = await getPagedStoreProducts(0, 200);

      if (allProductList.success) {
        setProducts(allProductList.data);
      } else {
        console.log(allProductList.message);
      }

      if (pagedStoreProducts.success) {
        setMallProducts(pagedStoreProducts.data);
      } else {
        console.log(pagedStoreProducts.message);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductClick = (productId) => () => {
    navigate(`/product/${productId}`);
  };

  return (
    <>
      <div className="slider">
        <Swiper
          slidesPerView={1} // Default to 1 for smaller screens
          centeredSlides={true}
          spaceBetween={30}
          navigation={true}
          modules={[Navigation]}
          className="mySwiper"
          breakpoints={{
            768: {
              slidesPerView: 3, // Show 3 slides for screens wider than 768px
            },
          }}
        >
          {[...Array(20)].map((_, index) => (
            <SwiperSlide key={index}>
              <div className="slider__item">
                <img
                  src={bg}
                  className="slider__item-img"
                  alt={`Slide ${index + 1}`}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="fhome">
        <TitleBar icon={BsHandbag} titleText="電玩賞" moreText="更多" />
        <div className="fhome__list">
          {products.length > 0 ? (
            products
              .slice(0, 6)
              .map((product, index) => (
                <ProductCard
                  key={product.productId}
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

        <TitleBar icon={BsHandbag} titleText="商城" moreText="更多" />

        <div className="fhome__list">
          {mallProducts.length > 0 ? (
            mallProducts
              .slice(0, 6)
              .map((product, index) => (
                <ProductCard
                  key={index}
                  product={product}
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
