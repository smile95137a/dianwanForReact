import CircleIcon from '@/components/frontend/CircleIcon';
import NoData from '@/components/frontend/NoData';
import Pagination from '@/components/frontend/Pagination';
import ProductCard from '@/components/frontend/ProductCard';
import { usePagination } from '@/hooks/usePagination';
import { getPagedStoreProducts } from '@/services/frontend/storeProductService';
import React, { useEffect, useState } from 'react';
import { BsHandbag } from 'react-icons/bs';
import { FaSearch, FaSortAmountUpAlt, FaSortAmountUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Product = () => {
  const [sortOrder, setSortOrder] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  const navigate = useNavigate();

  const pagination = usePagination({
    list: filteredProducts,
    pageLimitSize: 10,
    initialPage: 1,
  });

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

  useEffect(() => {
    let updatedProducts = [...products];

    // 搜尋過濾
    if (searchTerm) {
      updatedProducts = updatedProducts.filter((product) =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 排序處理
    if (sortOrder === 'newest') {
      updatedProducts.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortOrder === 'bestseller') {
      updatedProducts.sort((a: any, b: any) => ~~b.popularity - ~~a.popularity);
    } else if (sortOrder === 'price-asc') {
      updatedProducts.sort((a: any, b: any) => {
        const priceA = a.isSpecialPrice ? a.specialPrice : a.price;
        const priceB = b.isSpecialPrice ? b.specialPrice : b.price;
        return priceA - priceB;
      });
    } else if (sortOrder === 'price-desc') {
      updatedProducts.sort((a: any, b: any) => {
        const priceA = a.isSpecialPrice ? a.specialPrice : a.price;
        const priceB = b.isSpecialPrice ? b.specialPrice : b.price;
        return priceB - priceA;
      });
    }

    setFilteredProducts(updatedProducts);
    pagination.goToPage(1);
  }, [searchTerm, sortOrder, products]);

  return (
    <div className="fMallProduct">
      <div className="fMallProduct__header">
        <div className="fMallProduct__header-search">
          <div className="fMallProduct__icon">
            <FaSearch />
          </div>

          <input
            type="text"
            placeholder="搜尋"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="fMallProduct__header-title">
          <div className="fMallProduct__icon">
            <CircleIcon icon={BsHandbag} />
          </div>
          <p className="fMallProduct__text">電玩賞</p>
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
        {filteredProducts.length > 0 && (
          <>
            {pagination.currentPageItems.map((product) => (
              <div key={product.productCode} className="fMallProduct__item">
                <div className="fMallProduct__item-main">
                  <ProductCard
                    product={product}
                    isMall={true}
                    className="productCard--mall"
                  />
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      {filteredProducts.length > 0 && (
        <>
          <Pagination {...pagination} />
        </>
      )}

      {filteredProducts.length === 0 && (
        <>
          <NoData />
        </>
      )}
    </div>
  );
};

export default Product;
