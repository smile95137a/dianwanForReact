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
  FaMinus,
  FaPlus,
  FaRegHeart,
  FaTruck,
} from 'react-icons/fa';

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

  const handleCart = () => {
    navigate('/cart');
  };

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
              <div className="mall-product__detail-otherPreOrder">
                <div className="mall-product__detail-otherPreOrder-title">
                  預購
                </div>
                <div className="mall-product__detail-otherPreOrder-other-text">
                  即日起 ~ 2024/11/30，商品預計將於 2024/11/30 陸續發貨
                </div>
              </div>
              <div className="mall-product__detail-otherLogistics">
                <div className="mall-product__detail-otherLogistics-title">
                  物流
                </div>
                <div className="mall-product__detail-otherLogistics-other">
                  <i className="fa-solid fa-truck"></i>
                  <div className="mall-product__detail-otherLogistics-other-text">
                    <FaTruck /> $160 ~ {product?.shippingPrice}
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
              <div className="mall-product__detail-action-btn">
                <FaCartPlus /> 加到購物車
              </div>
              <div
                className="mall-product__detail-action-btn mall-product__detail-action-btn--red"
                onClick={handleCart}
              >
                立即購買!
              </div>
            </div>
          </div>
        </div>

        <div className="mall-product__link">
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
        </div>
      </div>
    </>
  );
};

export default MallProductDetail;
