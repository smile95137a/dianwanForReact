import React, { useEffect, useState } from 'react';
import BTable from '@/components/backend/btable/BTable';
import BTableRow from '@/components/backend/btable/BTableRow';
import NoData from '@/components/backend/NoData';
import Pagination from '@/components/backend/Pagination';
import Card from '@/components/frontend/MCard';
import { usePagination } from '@/hooks/usePagination';
import {
  getAllRedemptionCodes,
  generateRedemptionCode,
} from '@/services/backend/RedemptionService';
import DateFormatter from '@/components/common/DateFormatter';
import { getAllProductsByType } from '@/services/backend/ProductService';
import { useBackendDialog } from '@/context/backend/useBackendDialog';
import { useLoading } from '@/context/frontend/LoadingContext';
import {
  deleteStoreProduct,
  getAllCategories,
  getAllStoreProducts,
} from '@/services/backend/StoreServices';
import { getImageUrl } from '@/utils/ImageUtils';
import NumberFormatter from '@/components/common/NumberFormatter';

const ProductDataManagement = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const pagination = usePagination({
    list: filteredProducts,
    pageLimitSize: 10,
    initialPage: 1,
  });

  const {
    openInfoDialog,
    openAddStoreProductDialog,
    openConfirmDialog,
    openProductCategoryManagementDialog,
  } = useBackendDialog();
  const { setLoading } = useLoading();

  const fetchProductList = async () => {
    try {
      setLoading(true);
      const { success, data, message } = await getAllStoreProducts();
      setLoading(false);
      if (success) {
        setProducts(data);
        setFilteredProducts(data);
      } else {
        setProducts([]);
        setFilteredProducts([]);
      }
    } catch (error) {
      setLoading(false);
      setProducts([]);
      setFilteredProducts([]);
      console.error('獲取商品列表失敗：', error);
    }
  };

  const applyFilters = () => {
    if (!selectedCategory) {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter(
          (product) => product.categoryId.toString() === selectedCategory
        )
      );
    }
  };

  const openStoreProductDialog = async () => {
    const result = await openAddStoreProductDialog();
    if (result) {
      fetchProductList();
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { success, data, code, message } = await getAllCategories();

      setLoading(false);
      if (success) {
        setCategories(data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const filterProducts = () => {
    if (!selectedCategory) {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter(
          (product) => product.categoryId.toString() === selectedCategory
        )
      );
    }
  };

  const formatDimensions = (product: any) => {
    return `${product.width || 0} x ${product.height || 0} x ${
      product.length || 0
    }`;
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(
      (c) => c.categoryId.toString() === categoryId
    );
    return category ? category.categoryName : `Category ${categoryId}`;
  };

  const handleEdit = (data: any) => async () => {
    const result = await openAddStoreProductDialog(true, data);
    if (result) {
      fetchProductList();
    }
  };

  const handleDelete = async (id: number) => {
    const result = await openConfirmDialog(
      '系統提示',
      '確定要刪除這個商品嗎？'
    );

    if (result) {
      try {
        setLoading(true);
        const { success } = await deleteStoreProduct(id);
        setLoading(false);
        if (success) {
          await openInfoDialog('系統提示', '商品已成功刪除！');
          fetchProductList();
        } else {
          await openInfoDialog('系統提示', '刪除失敗，請稍後再試！');
        }
      } catch (error) {
        setLoading(false);
        console.error('Error deleting product:', error);
        await openInfoDialog('系統提示', '刪除失敗，請稍後再試！');
      }
    }
  };

  useEffect(() => {
    fetchProductList();
    fetchCategories();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedCategory, products]);

  const openProductCategoryManagement = () => {
    openProductCategoryManagementDialog();
  };

  return (
    <div className="storeManagement">
      <p className="storeManagement__title">產品系列管理</p>
      <button
        onClick={openStoreProductDialog}
        className="storeManagement__btn m-b-12"
      >
        新增商品
      </button>
      <button
        onClick={openProductCategoryManagement}
        className="storeManagement__btn m-b-12"
      >
        管理商品類別
      </button>
      <div className="storeManagement__productFilter">
        篩選產品：
        <select
          id="filterCategory"
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            filterProducts();
          }}
          className="filter-select"
        >
          <option value="">全部</option>
          {categories.map((category) => (
            <option
              key={category.categoryId}
              value={category.categoryId.toString()}
            >
              {category.categoryName}
            </option>
          ))}
        </select>
      </div>

      <div className="storeManagement__list">
        {filteredProducts.length > 0 ? (
          <div className="storeManagement__list-content">
            <BTable
              headers={[
                { text: '圖片', className: '' },
                { text: '名稱', className: '' },
                { text: '描述', className: '' },
                { text: '價格', className: '' },
                { text: '售出數量', className: '' },
                { text: '庫存', className: '' },
                { text: '尺寸 (寬x高x深)', className: '' },
                { text: '類別', className: '' },
                { text: '操作', className: '' },
              ]}
            >
              {pagination.currentPageItems.map((x, index) => (
                <BTableRow
                  key={index}
                  data={[
                    {
                      content: (
                        <>
                          <img
                            src={getImageUrl(x.imageUrl[0])}
                            alt="商品圖片"
                            className="storeManagement__image"
                          />
                        </>
                      ),
                      dataTitle: '圖片',
                    },
                    {
                      content: <>{x.productName}</>,
                      dataTitle: '名稱',
                    },
                    {
                      content: <>{x.description}</>,
                      dataTitle: '描述',
                    },
                    {
                      content: (
                        <>
                          <NumberFormatter number={x.price} />
                        </>
                      ),
                      dataTitle: '價格',
                    },
                    {
                      content: (
                        <>
                          <NumberFormatter number={x.soldQuantity} />
                        </>
                      ),
                      dataTitle: '售出數量',
                    },
                    {
                      content: (
                        <>
                          <NumberFormatter number={x.stockQuantity} />
                        </>
                      ),
                      dataTitle: '庫存',
                    },
                    {
                      content: <>{formatDimensions(x)}</>,
                      dataTitle: '尺寸 (寬x高x深)',
                    },
                    {
                      content: <>{getCategoryName(x.categoryId)}</>,
                      dataTitle: '類別',
                    },
                    {
                      content: (
                        <>
                          <div className="storeManagement__btns">
                            <button
                              className="storeManagement__btn storeManagement__btn--edit"
                              onClick={handleEdit(x)}
                            >
                              編輯
                            </button>
                            <button
                              className="storeManagement__btn storeManagement__btn--del"
                              onClick={() => handleDelete(x.storeProductId)}
                            >
                              刪除
                            </button>
                          </div>
                        </>
                      ),
                      dataTitle: '操作',
                    },
                  ]}
                />
              ))}
            </BTable>
            <Pagination {...pagination} />
          </div>
        ) : (
          <Card>
            <NoData />
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProductDataManagement;
