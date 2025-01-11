import NumberFormatter from '@/components/common/NumberFormatter';
import CircleIcon from '@/components/frontend/CircleIcon';
import NoData from '@/components/frontend/NoData';
import Pagination from '@/components/frontend/Pagination';
import ProductCard from '@/components/frontend/ProductCard';
import { useLoading } from '@/context/frontend/LoadingContext';
import { usePagination } from '@/hooks/usePagination';
import { getAllCategories } from '@/services/frontend/storeCategoryService';
import { getPagedStoreProducts } from '@/services/frontend/storeProductService';
import React, { useEffect, useRef, useState } from 'react';
import { BsHandbag } from 'react-icons/bs';
import { FaSearch, FaSortAmountUpAlt, FaSortAmountUp } from 'react-icons/fa';

const MallProduct = () => {
  const [sortOrder, setSortOrder] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
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
      const { success, message, data } = await getPagedStoreProducts(0, 200);
      if (success) {
        const filteredProducts = data;

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoryOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleCategoryDropdown = () => setIsCategoryOpen(!isCategoryOpen);

  const handleCategorySelection = (categoryUUid: number) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(categoryUUid)
        ? prevSelected.filter((id) => id !== categoryUUid)
        : [...prevSelected, categoryUUid]
    );
  };
  return (
    <div className="fMallProduct">
      <div className="fMallProduct__header">
        <div className="fMallProduct__header-inputs">
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

          <div
            ref={categoryDropdownRef}
            className={`fMallProduct__header-category fMallProduct__header-category--orange ${
              isCategoryOpen ? 'fMallProduct__header-category--open' : ''
            }`}
          >
            <div
              onClick={toggleCategoryDropdown}
              className="fMallProduct__header-category__trigger"
            >
              請選擇商品
            </div>
            {isCategoryOpen && (
              <div className="fMallProduct__header-category__content">
                {categories.map((item) => (
                  <label
                    key={item.categoryUUid}
                    htmlFor={`category-${item.categoryUUid}`}
                    className={`fMallProduct__header-category__item ${
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
        {filteredProducts.length > 0 && (
          <>
            {pagination.currentPageItems.map((product) => (
              <div key={product.productId} className="fMallProduct__item">
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

export default MallProduct;
