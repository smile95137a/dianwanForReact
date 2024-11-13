import CircleIcon from '@/components/frontend/CircleIcon';
import NoData from '@/components/frontend/NoData';
import Pagination from '@/components/frontend/Pagination';
import ProductCard from '@/components/frontend/ProductCard';
import { usePagination } from '@/hooks/usePagination';
import { getPagedStoreProducts } from '@/services/frontend/storeProductService';
import React, { useEffect, useState } from 'react';
import { BsHandbag } from 'react-icons/bs';
import { FaSearch, FaSortAmountUp, FaSortAmountUpAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const MallProduct = () => {
  const [sortOrder, setSortOrder] = useState('newest');
  const [products, setProducts] = useState<any[]>([]);
  const pagination = usePagination({
    list: products,
    pageLimitSize: 10,
    initialPage: 1,
  });

  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const { success, message, data } = await getPagedStoreProducts(0, 200);
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
    navigate(`/mallProduct/${productId}`);
  };

  return (
    <div className="fMallProduct">
      <div className="fMallProduct__header">
        <div className="fMallProduct__header-search">
          <div className="fMallProduct__icon">
            <FaSearch />
          </div>

          <input type="text" placeholder="搜尋" />
        </div>
        <div className="fMallProduct__header-title">
          <div className="fMallProduct__icon">
            <CircleIcon icon={BsHandbag} />
          </div>
          <p className="fMallProduct__text">商城</p>
        </div>

        <div className="fMallProduct__header-nav">
          <div className="fMallProduct__sort">
            <div
              className={`fMallProduct__sort-btn ${
                sortOrder === 'newest' ? 'fMallProduct__sort-btn--active' : ''
              }`}
              onClick={() => setSortOrder('newest')}
            >
              最新
            </div>
            <div
              className={`fMallProduct__sort-btn ${
                sortOrder === 'bestseller'
                  ? 'fMallProduct__sort-btn--active'
                  : ''
              }`}
              onClick={() => setSortOrder('bestseller')}
            >
              最熱銷
            </div>
            <div
              className={`fMallProduct__sort-btn ${
                sortOrder === 'price-asc'
                  ? 'fMallProduct__sort-btn--active'
                  : ''
              }`}
              onClick={() => setSortOrder('price-asc')}
            >
              價格低到高
              <FaSortAmountUpAlt />
            </div>
            <div
              className={`fMallProduct__sort-btn ${
                sortOrder === 'price-desc'
                  ? 'fMallProduct__sort-btn--active'
                  : ''
              }`}
              onClick={() => setSortOrder('price-desc')}
            >
              價格高到低
              <FaSortAmountUp />
            </div>
          </div>
        </div>
      </div>
      <div className="fMallProduct__list">
        {products.length > 0 ? (
          pagination.currentPageItems.map((product) => (
            <div
              className="fMallProduct__item"
              onClick={handleProductClick(product.productCode)}
            >
              <div className="fMallProduct__item-main">
                <ProductCard
                  key={product.productId}
                  product={product}
                  className="productCard--mall"
                />
              </div>
            </div>
          ))
        ) : (
          <>
            <NoData />
          </>
        )}
      </div>
      <Pagination {...pagination} />
    </div>
  );
};

export default MallProduct;
