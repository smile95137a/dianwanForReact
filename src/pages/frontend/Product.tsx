import CircleIcon from '@/components/frontend/CircleIcon';
import NoData from '@/components/frontend/NoData';
import ProductCard from '@/components/frontend/ProductCard';
import {
  IProduct,
  getAllProductList,
} from '@/services/frontend/productService';
import { getImageUrl } from '@/utils/ImageUtils';
import React, { useEffect, useState } from 'react';
import { BsHandbag } from 'react-icons/bs';
import { FaSearch, FaSortAmountUpAlt, FaSortAmountUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Product = () => {
  const [sortOrder, setSortOrder] = useState('newest');
  const [products, setProducts] = useState<IProduct[]>([]);

  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const { success, message, data } = await getAllProductList();
      if (success) {
        setProducts(data);
      } else {
        console.log(message);
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
    <div className="fproduct">
      <div className="fproduct__header">
        <div className="fproduct__header-search">
          <div className="fproduct__icon">
            <FaSearch />
          </div>

          <input type="text" placeholder="搜尋" />
        </div>
        <div className="fproduct__header-title">
          <div className="fproduct__icon">
            <CircleIcon icon={BsHandbag} />
          </div>
          <p className="fproduct__text">電玩賞</p>
        </div>

        <div className="fproduct__header-nav">
          <div className="fproduct__sort">
            <div
              className={`fproduct__sort-btn ${
                sortOrder === 'newest' ? 'fproduct__sort-btn--active' : ''
              }`}
              onClick={() => setSortOrder('newest')}
            >
              最新
            </div>
            <div
              className={`fproduct__sort-btn ${
                sortOrder === 'bestseller' ? 'fproduct__sort-btn--active' : ''
              }`}
              onClick={() => setSortOrder('bestseller')}
            >
              最熱銷
            </div>
            <div
              className={`fproduct__sort-btn ${
                sortOrder === 'price-asc' ? 'fproduct__sort-btn--active' : ''
              }`}
              onClick={() => setSortOrder('price-asc')}
            >
              價格低到高
              <FaSortAmountUpAlt />
            </div>
            <div
              className={`fproduct__sort-btn ${
                sortOrder === 'price-desc' ? 'fproduct__sort-btn--active' : ''
              }`}
              onClick={() => setSortOrder('price-desc')}
            >
              價格高到低
              <FaSortAmountUp />
            </div>
          </div>
        </div>
      </div>
      <div className="fproduct__list">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              className="fproduct__item"
              onClick={handleProductClick(product.productId)}
            >
              <div className="fproduct__item-main">
                <ProductCard key={product.productId} product={product} />
              </div>
              <div className="fproduct__item-detail">
                <div className="fproduct__item-info">
                  <div className="fproduct__item-infoDetail">
                    <p className="fproduct__text">箱號：12298</p>
                    <p className="fproduct__text">剩 511 抽</p>
                  </div>
                  <div className="fproduct__item-infoDetail">
                    <p className="fproduct__text">每抽：350 元</p>
                    <p className="fproduct__text">10 抽 3000 元</p>
                  </div>
                </div>
                <div className="fproduct__item-list">
                  <p className="fproduct__item-listItem">
                    <span className="fproduct__text">SP賞</span>
                    <span className="fproduct__text">
                      Switch oled版顏色隨機
                    </span>
                    <span className="fproduct__text">1/1</span>
                  </p>{' '}
                  <p className="fproduct__item-listItem">
                    <span className="fproduct__text">SP賞</span>
                    <span className="fproduct__text">
                      Switch oled版顏色隨機
                    </span>
                    <span className="fproduct__text">1/1</span>
                  </p>{' '}
                  <p className="fproduct__item-listItem">
                    <span className="fproduct__text">SP賞</span>
                    <span className="fproduct__text">
                      Switch oled版顏色隨機
                    </span>
                    <span className="fproduct__text">1/1</span>
                  </p>{' '}
                  <p className="fproduct__item-listItem">
                    <span className="fproduct__text">SP賞</span>
                    <span className="fproduct__text">
                      Switch oled版顏色隨機
                    </span>
                    <span className="fproduct__text">1/1</span>
                  </p>{' '}
                  <p className="fproduct__item-listItem">
                    <span className="fproduct__text">SP賞</span>
                    <span className="fproduct__text">
                      Switch oled版顏色隨機
                    </span>
                    <span className="fproduct__text">1/1</span>
                  </p>{' '}
                  <p className="fproduct__item-listItem">
                    <span className="fproduct__text">SP賞</span>
                    <span className="fproduct__text">
                      Switch oled版顏色隨機
                    </span>
                    <span className="fproduct__text">1/1</span>
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <>
            <NoData />
          </>
        )}
      </div>
    </div>
  );
};

export default Product;