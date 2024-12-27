import NumberFormatter from '@/components/common/NumberFormatter';
import CircleIcon from '@/components/frontend/CircleIcon';
import NoData from '@/components/frontend/NoData';
import Pagination from '@/components/frontend/Pagination';
import ProductCard from '@/components/frontend/ProductCard';
import { useLoading } from '@/context/frontend/LoadingContext';
import { usePagination } from '@/hooks/usePagination';
import { PrizeCategory } from '@/interfaces/product';
import { getAllCategories } from '@/services/frontend/productCategoryService';
import {
  IProduct,
  getAllProductList,
} from '@/services/frontend/productService';
import { getImageUrl } from '@/utils/ImageUtils';
import { genRandom } from '@/utils/RandomUtils';
import React, { useEffect, useState } from 'react';
import { BsHandbag } from 'react-icons/bs';
import { FaSearch, FaSortAmountUpAlt, FaSortAmountUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Product3C = () => {
  const [sortOrder, setSortOrder] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const { setLoading } = useLoading();

  const pagination = usePagination({
    list: filteredProducts,
    pageLimitSize: 10,
    initialPage: 1,
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { success, message, data } = await getAllCategories();
      setLoading(false);
      if (success) {
        setCategories(data);
      } else {
        console.log(message);
      }
    } catch (error) {
      setLoading(false);
      console.log('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const { success, message, data } = await getAllProductList();
      if (success) {
        const filteredProducts = data.filter(
          (item) => item.prizeCategory === PrizeCategory.C3
        );
        setProducts(filteredProducts);
      } else {
        console.log(message);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
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
    updatedProducts = updatedProducts.filter(
      (product) =>
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.categoryUUid)
    );

    setFilteredProducts(updatedProducts);
    pagination.goToPage(1);
  }, [searchTerm, sortOrder, products, selectedCategories]);

  const toggleCategoryDropdown = () => setIsCategoryOpen(!isCategoryOpen);
  const handleCategorySelection = (categoryUUid: number) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(categoryUUid)
        ? prevSelected.filter((id) => id !== categoryUUid)
        : [...prevSelected, categoryUUid]
    );
  };
  return (
    <div className="fproduct">
      <div className="fproduct__header">
        <div className="fproduct__header-inputs">
          <div className="fproduct__header-search">
            <div className="fproduct__icon">
              <FaSearch />
            </div>

            <input
              type="text"
              placeholder="搜尋"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div
            className={`fproduct__header-category ${
              isCategoryOpen ? 'fproduct__header-category--open' : ''
            }`}
          >
            <div
              onClick={toggleCategoryDropdown}
              className="fproduct__header-category__trigger"
            >
              請選擇商品
            </div>
            {isCategoryOpen && (
              <div className="fproduct__header-category__content">
                {categories.map((item) => (
                  <label
                    key={item.categoryUUid}
                    htmlFor={`category-${item.categoryUUid}`}
                    className={`fproduct__header-category__item ${
                      selectedCategories.includes(item.categoryUUid)
                        ? 'checked'
                        : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(item.categoryUUid)}
                      onChange={() =>
                        handleCategorySelection(item.categoryUUid)
                      }
                      id={`category-${item.categoryUUid}`}
                    />
                    {item.categoryName}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="fproduct__header-title">
          <div className="fproduct__icon">
            <CircleIcon icon={BsHandbag} />
          </div>
          <p className="fproduct__text">3C賞</p>
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
        {filteredProducts.length > 0 && (
          <>
            {pagination.currentPageItems.map((product) => (
              <div key={product.productId} className="fproduct__item">
                <div className="fproduct__item-main">
                  <ProductCard product={product} />
                </div>
                <div className="fproduct__item-detail">
                  <div className="fproduct__item-info">
                    <div className="fproduct__item-infoDetail">
                      <p className="fproduct__text">
                        箱號：{product.productId}
                      </p>
                      <p className="fproduct__text">
                        剩 {product.detailQuantity} 抽
                      </p>
                    </div>
                    <div className="fproduct__item-infoDetail">
                      <p className="fproduct__text">
                        每抽：
                        <NumberFormatter number={product.price} />元
                      </p>
                      <p className="fproduct__text">
                        10 抽
                        <NumberFormatter number={product.price * 10} />元
                      </p>
                    </div>
                  </div>
                  <div className="fproduct__item-list">
                    {product?.productDetails?.map(
                      (pDetail: any, index: any) => (
                        <p key={index} className="fproduct__item-listItem">
                          <span className="fproduct__text">
                            {pDetail.grade}賞
                          </span>
                          <span className="fproduct__text">
                            {pDetail.productName}
                          </span>
                          <span className="fproduct__text">
                            <NumberFormatter number={pDetail.quantity} />
                            /
                            <NumberFormatter number={pDetail.stockQuantity} />
                          </span>
                        </p>
                      )
                    )}
                  </div>
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

export default Product3C;
