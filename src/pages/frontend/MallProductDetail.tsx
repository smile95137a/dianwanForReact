import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumbs from '@/components/frontend/Breadcrumbs';
import se from '@/assets/image/711.png';
import familyMart from '@/assets/image/familyMart.png';
import lineImg from '@/assets/image/line.png';
import linkImg from '@/assets/image/link.png';
import metaImg from '@/assets/image/meta.png';
import { getMappingById } from '@/services/frontend/recommendationService';
import { getStoreProductById } from '@/services/frontend/storeProductService';
import { getImageUrl } from '@/utils/ImageUtils';
import NumberFormatter from '@/components/common/NumberFormatter';
import {
  FaCartPlus,
  FaChevronDown,
  FaChevronUp,
  FaMinus,
  FaPlus,
  FaRegHeart,
  FaTruck,
} from 'react-icons/fa';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import { useFrontendDialog } from '@/context/frontend/useFrontedDialog';
import {
  addCartItem,
  checkQuantity,
} from '@/services/frontend/cartItemService';
import { useLoading } from '@/context/frontend/LoadingContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import ProductCard from '@/components/frontend/ProductCard';
import { genRandom } from '@/utils/RandomUtils';
import productContactImg from '@/assets/image/di-p-info.png';
import SocialLinks from '@/components/common/SocialLinks';
const MallProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [breadcrumbItems, setBreadcrumbItems] = useState([
    { name: '首頁' },
    { name: '商城' },
  ]);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState('');
  const [likedProducts, setLikedProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [hotProducts, setHotProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('詳情');
  const [expanded, setExpanded] = useState(false);

  const isLogin = useSelector(
    (state: RootState) => state.frontend.auth.isLogin
  );
  const { setLoading } = useLoading();
  const { openInfoDialog, openDrawDialog } = useFrontendDialog();

  const loadProductData = async () => {
    try {
      const [
        productResponse,
        likedResponse,
        recommendedResponse,
        hotProductsRes,
      ] = await Promise.all([
        getStoreProductById(id),
        getMappingById(1),
        getMappingById(2),
        getMappingById(3),
      ]);

      if (productResponse.success) {
        const data = productResponse.data;
        setProduct(data);
        setSelectedImage(data.imageUrls[0] ?? '');
        setFavoriteCount(data.favoritesCount ?? 0);
        setIsFavorite(data.favorited ?? false);
        setBreadcrumbItems((prevItems) => [
          ...prevItems,
          { name: data.productName },
        ]);
      }

      if (likedResponse?.success) {
        setLikedProducts(likedResponse.data);
      }

      if (recommendedResponse?.success) {
        setRecommendedProducts(recommendedResponse.data);
      }

      if (hotProductsRes?.success) {
        setHotProducts(hotProductsRes.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadProductData();
  }, [id]);

  const changeMainImage = (index) => {
    setSelectedImageIndex(index);
    setSelectedImage(product.imageUrls[index]);
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  const toggleExpand = () => setExpanded(!expanded);

  const handleAddToCart = async (redirectToCheckout = false) => {
    if (!isLogin) {
      await openInfoDialog('系統消息', '請先登入');
      return;
    }

    if (product) {
      const cartItem = {
        productCode: product.productCode,
        quantity: quantity,
      };
      const isCanAddCart = await checkQuantity(cartItem);

      if (isCanAddCart.success) {
        try {
          setLoading(true);
          const response = await addCartItem(cartItem);
          setLoading(false);
          if (response.success) {
            if (redirectToCheckout) {
              navigate('/cart');
            } else {
              await openInfoDialog('系統消息', '商品成功加到購物車');
            }
          } else {
            await openInfoDialog(
              '系統消息',
              `添加購物車失敗: ${response.message}`
            );
          }
        } catch (error) {
          setLoading(false);
          console.error('添加購物車時發生錯誤:', error);
          await openInfoDialog(
            '系統消息',
            '添加購物車時發生錯誤，請稍後再試。'
          );
        }
      } else {
        await openInfoDialog('系統消息', '超出庫存數量。');
      }
    }
  };

  const addProductToCart = async () => {
    await handleAddToCart();
  };

  const buyItNow = async () => {
    await handleAddToCart(true);
  };

  return (
    <>
      <div className="mall-product">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="mall-product__main">
          <div className="mall-product__img">
            <div className="mall-product__img-main">
              {selectedImage && <img src={getImageUrl(selectedImage)} />}
            </div>
            <div className="mall-product__img-other">
              {product?.imageUrls?.map((imageUrl, index) => (
                <div
                  key={index}
                  className={`mall-product__img-otherItem ${
                    selectedImageIndex === index
                      ? 'mall-product__img-otherItem--active'
                      : ''
                  }`}
                  onClick={() => changeMainImage(index)}
                >
                  <img src={getImageUrl(imageUrl)} />
                </div>
              ))}
            </div>
          </div>
          <div className="mall-product__detail">
            <div className="mall-product__detail-title">
              {product?.productName}
            </div>
            <div className="mall-product__detail-prices">
              <div className="mall-product__detail-priceMain">
                <div className="mall-product__detail-priceMoney">
                  <NumberFormatter
                    number={
                      product?.isSpecialPrice
                        ? product?.specialPrice
                        : product?.price
                    }
                  />
                </div>
                <span className="mall-product__text">元</span>
              </div>
            </div>

            <div className="mall-product__detail-other">
              <div className="mall-product__detail-otherNum">
                <div className="mall-product__detail-otherNum-title">數量</div>
                <div className="mall-product__detail-otherNum-other">
                  <button
                    className="mall-product__detail-otherNum-btn"
                    onClick={decreaseQuantity}
                  >
                    <FaMinus />
                  </button>
                  <div className="mall-product__detail-otherNum-text">
                    {quantity}
                  </div>
                  <button
                    className="mall-product__detail-otherNum-btn mall-product__detail-otherNum-btn--active"
                    onClick={increaseQuantity}
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>

              <div className="mall-product__detail-otherLogistics">
                <div className="mall-product__detail-otherLogistics-title">
                  物流
                </div>
                <div className="mall-product__detail-otherLogistics-other">
                  <i className="fa-solid fa-truck"></i>
                  <div className="mall-product__detail-otherLogistics-other-text">
                    <FaTruck /> ${product?.shippingPrice} ~ $160
                  </div>
                  <div className="mall-product__detail-otherLogistics-other-icon">
                    <img src={se} alt="711 logo" />
                    <img src={familyMart} alt="FamilyMart logo" />
                  </div>
                </div>
              </div>
              <div className="mall-product__detail-otherPay">
                <div className="mall-product__detail-otherPreOrder-title">
                  付款
                </div>
                <div className="mall-product__detail-otherPreOrder-other-text">
                  信用卡、超商取貨付款
                </div>
              </div>
            </div>
            <div className="mall-product__detail-action">
              <div
                className="mall-product__detail-action-btn"
                onClick={addProductToCart}
              >
                <FaCartPlus /> 加到購物車
              </div>
              <div
                className="mall-product__detail-action-btn mall-product__detail-action-btn--red"
                onClick={buyItNow}
              >
                立即購買!
              </div>
            </div>
          </div>
        </div>

        <div className="flex ">
          <div className="mall-product__link flex-1">
            <div className="mall-product__linkItem">
              <div className="mall-product__linkItem-title">分享</div>
              <div className="mall-product__linkItem-main mall-product__linkItem-main--share">
                <img src={lineImg} alt="Share on Line" />
                <img src={metaImg} alt="Share on Facebook" />
                <img src={linkImg} alt="Copy link" />
              </div>
            </div>

            <div className="w-100 mall-product__linkItem">
              <div className="mall-product__linkItem-title">分類</div>
              <div className="mall-product__linkItem-main mall-product__linkItem-main--category">
                主分類：{product?.categoryName}
              </div>
            </div>
            <div className="w-100 mall-product__linkItem">
              <div className="mall-product__linkItem-title">收藏</div>
              <div className="mall-product__linkItem-main mall-product__linkItem-main--likeIcon">
                <FaRegHeart /> ({favoriteCount})
              </div>
            </div>
            <div className="w-100 mall-product__linkItem">
              <div className="mall-product__linkItem-title">關鍵字</div>
              <div className="mall-product__linkItem-main mall-product__linkItem-main--hashTag">
                {product?.keywordList?.map((keywordObj, index) => (
                  <span key={index}>
                    {keywordObj.keyword}
                    {index < product.keywordList.length - 1 && '、'}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="mall-product__linkItem--info">
              <div className="productDetail__contact">
                <div className="productDetail__contact-img">
                  <img src={productContactImg} />
                </div>

                <div className="productDetail__contact-title">客服資訊</div>
                <div className="productDetail__contact-content">
                  平台操作或抽獎問題
                  <br />
                  聯繫官方資訊
                </div>
                <div className="productDetail__contact-social">
                  <SocialLinks />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mall-product__tabs">
          <div className="mall-product__tab-header">
            {['詳情', '規格'].map((tab, index) => (
              <div
                key={index}
                className={`mall-product__tab-item ${
                  activeTab === tab ? 'mall-product__tab-item--active' : ''
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </div>
            ))}
          </div>
          <div
            className="mall-product__tab-content"
            style={{
              height: expanded ? 'auto' : '180px',
              overflow: expanded ? 'visible' : 'hidden',
            }}
          >
            {activeTab === '詳情' && (
              <div dangerouslySetInnerHTML={{ __html: product?.details }} />
            )}
            {activeTab === '規格' && (
              <div
                dangerouslySetInnerHTML={{ __html: product?.specification }}
              />
            )}
          </div>
          {!expanded && (
            <div className="mall-product__tab-more" onClick={toggleExpand}>
              <div className="mall-product__tab-more-btn">
                <span>展開更多</span>
                <FaChevronDown />
              </div>
            </div>
          )}
          {expanded && (
            <div className="mall-product__tab-more" onClick={toggleExpand}>
              <div className="mall-product__tab-more-btn">
                <span>收合</span>
                <FaChevronUp />
              </div>
            </div>
          )}
        </div>

        <div className="mall-product__slider m-y-24">
          <div className="mall-product__sliderTitle">
            <div className="mall-product__sliderTitle-text">你可能會喜歡</div>
          </div>
          <div className="mall-product__slider-list">
            <div className="mall-product__slider-main">
              <Swiper
                slidesPerView={3}
                spaceBetween={10}
                navigation
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                pagination={{ clickable: true }}
                modules={[Navigation, Pagination, Autoplay]}
                loop={true}
              >
                {likedProducts.map((product, index) => (
                  <SwiperSlide key={index}>
                    <ProductCard
                      key={genRandom(24)}
                      product={product}
                      isMall={true}
                      className="productCard--mall"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>

        <div className="mall-product__recommendations">
          <p className="mall-product__text">店長推薦</p>
          <div className="mall-product__recommendations-list">
            {recommendedProducts.slice(0, 6).map((product) => (
              <ProductCard
                key={genRandom(24)}
                product={product}
                isMall={true}
                className="productCard--mall"
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MallProductDetail;
