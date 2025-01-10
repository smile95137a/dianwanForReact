import React, { useEffect, useState } from 'react';
import BTable from '@/components/backend/btable/BTable';
import BTableRow from '@/components/backend/btable/BTableRow';
import NoData from '@/components/backend/NoData';
import Pagination from '@/components/backend/Pagination';
import Card from '@/components/frontend/MCard';
import { usePagination } from '@/hooks/usePagination';
import {
  copyProduct,
  deleteProduct,
  getAllProducts,
} from '@/services/backend/ProductService';
import { useBackendDialog } from '@/context/backend/useBackendDialog';
import { useLoading } from '@/context/frontend/LoadingContext';
import { getAllCategories } from '@/services/backend/StoreServices';
import { getImageUrl } from '@/utils/ImageUtils';
import NumberFormatter from '@/components/common/NumberFormatter';
import { PrizeCategory, ProductStatus } from '@/interfaces/product';
const productStatusOptions: Record<ProductStatus, string> = {
  [ProductStatus.AVAILABLE]: '上架',
  [ProductStatus.UNAVAILABLE]: '下架',
  [ProductStatus.NOT_AVAILABLE_YET]: '上架大賞已售完',
  [ProductStatus.SOLD_OUT]: '上架已售完',
};

const ProductDataManagement = () => {
  enum ProductType {
    PRIZE = 'PRIZE',
    GACHA = 'GACHA',
    BLIND_BOX = 'BLIND_BOX',
    CUSTMER_PRIZE = 'CUSTMER_PRIZE',
  }

  const productTypeOptions = [
    { value: '', label: '請選擇' },
    { value: ProductType.PRIZE, label: '電玩賞' },
    { value: ProductType.GACHA, label: '扭蛋' },
    { value: ProductType.BLIND_BOX, label: '盲盒' },
    { value: ProductType.CUSTMER_PRIZE, label: '自製獎品' },
  ];

  const prizeCategoryOptions = [
    { value: '', label: '請選擇' },
    { value: PrizeCategory.FIGURE, label: '官方電玩賞' },
    { value: PrizeCategory.C3, label: '家電電玩賞' },
    { value: PrizeCategory.BONUS, label: '紅利賞' },
    { value: PrizeCategory.PRIZESELF, label: '自製賞' },
    { value: PrizeCategory.NONE, label: '無' },
  ];

  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [, setCategories] = useState<any[]>([]);
  const [filterProductType, setFilterProductType] = useState('');
  const [filterPrizeCategory, setFilterPrizeCategory] = useState('');
  const [categoryNameMap, setCategoryNameMap] = useState<any>(new Map());

  const pagination = usePagination({
    list: filteredProducts,
    pageLimitSize: 10,
    initialPage: 1,
  });

  const {
    openInfoDialog,
    openAddProductDialog,
    openConfirmDialog,
    openProductCategoryManagementDialog,
    openProductDetailDialog,
  } = useBackendDialog();
  const { setLoading } = useLoading();

  const fetchProductList = async () => {
    try {
      setLoading(true);
      const { success, data } = await getAllProducts();
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

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { success, data } = await getAllCategories();
      setLoading(false);
      if (success) {
        setCategories(data);
        const mData = new Map(
          data.map((category: any) => [
            category.categoryId,
            category.categoryName,
          ])
        );
        setCategoryNameMap(mData);
      } else {
        setCategories([]);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  // Filtering logic for products based on type and prize category
  useEffect(() => {
    setFilteredProducts(() =>
      products.filter((product) => {
        if (filterProductType && product.productType !== filterProductType) {
          return false;
        }
        if (
          filterProductType === ProductType.PRIZE &&
          filterPrizeCategory &&
          product.prizeCategory !== filterPrizeCategory
        ) {
          return false;
        }
        return true;
      })
    );
  }, [filterProductType, filterPrizeCategory, products]);

  const handleOpenProductDialog = async () => {
    const result = await openAddProductDialog();
    if (result) {
      fetchProductList();
    }
  };

  const handleEdit = (data: any) => async () => {
    const result = await openAddProductDialog(true, data);
    if (result) {
      fetchProductList();
    }
  };
  const handleDuplicate = (data: any) => async () => {
    try {
      setLoading(true);
      const { success } = await copyProduct(data.productId);
      setLoading(false);
      if (success) {
        await openInfoDialog('系統提示', '商品已成功複製！');
        fetchProductList();
      } else {
        await openInfoDialog('系統提示', '複製失敗，請稍後再試！');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error copyProduct product:', error);
      await openInfoDialog('系統提示', '複製失敗，請稍後再試！');
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
        const { success } = await deleteProduct(id);
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

  const handlePDetail = async (data: any) => {
    openProductDetailDialog(data);
  };

  useEffect(() => {
    fetchProductList();
    fetchCategories();
  }, []);

  const openProductCategoryManagement = () => {
    openProductCategoryManagementDialog();
  };

  const getPrizeCategoryDescription = (category: any) => {
    switch (category) {
      case PrizeCategory.FIGURE:
        return '電玩賞';
      case PrizeCategory.C3:
        return '家電電玩賞';
      case PrizeCategory.BONUS:
        return '紅利電玩賞';
      case PrizeCategory.PRIZESELF:
        return '自製賞';
      case PrizeCategory.NONE:
      default:
        return '無';
    }
  };

  const getCategoryName = (categoryId: number | null) => {
    if (!categoryId) return '-';
    return categoryNameMap.get(categoryId) || '-';
  };

  const getProductStatus = (status: ProductStatus): string => {
    return productStatusOptions[status] || '未知狀態';
  };

  return (
    <div className="productDataManagement">
      <p className="productDataManagement__title">產品系列管理</p>
      <div className="flex gap-x-12">
        <button
          onClick={handleOpenProductDialog}
          className="productDataManagement__btn m-b-12"
        >
          新增商品
        </button>
        <button
          onClick={openProductCategoryManagement}
          className="productDataManagement__btn m-b-12"
        >
          管理商品類別
        </button>
      </div>
      <div className="productDataManagement__productFilter">
        篩選產品：
        <select
          value={filterProductType}
          onChange={(e) => {
            setFilterProductType(e.target.value);
            if (e.target.value !== ProductType.PRIZE) {
              setFilterPrizeCategory('');
            }
          }}
        >
          {productTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {filterProductType === ProductType.PRIZE && (
          <select
            value={filterPrizeCategory}
            onChange={(e) => setFilterPrizeCategory(e.target.value)}
          >
            {prizeCategoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="productDataManagement__list">
        {filteredProducts.length > 0 ? (
          <div className="productDataManagement__list-content">
            <BTable
              headers={[
                { text: '圖片', className: '' },
                { text: '產品名稱', className: '' },
                { text: '類型', className: '' },
                { text: '電玩賞類別', className: '' },
                { text: '金幣價格', className: '' },
                { text: '銀幣價格', className: '' },
                { text: '紅利價格', className: '' },
                { text: '庫存', className: '' },
                { text: '狀態', className: '' },
                { text: '商品類別', className: '' },
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
                          {Array.isArray(x?.imageUrls) &&
                            x.imageUrls.length > 0 && (
                              <img
                                className="productDataManagement__image"
                                src={getImageUrl(x.imageUrls[0])}
                                width={80}
                                height={80}
                              />
                            )}
                        </>
                      ),
                      dataTitle: '圖片',
                    },
                    {
                      content: <>{x.productName}</>,
                      dataTitle: '產品名稱',
                    },
                    {
                      content: <>{x.productType}</>,
                      dataTitle: '類型',
                    },
                    {
                      content: (
                        <>{getPrizeCategoryDescription(x.prizeCategory)}</>
                      ),
                      dataTitle: '電玩賞類別',
                    },
                    {
                      content: (
                        <>
                          <NumberFormatter number={~~x.price} />
                        </>
                      ),
                      dataTitle: '金幣價格',
                    },
                    {
                      content: (
                        <>
                          <NumberFormatter number={~~x.sliverPrice} />
                        </>
                      ),
                      dataTitle: '銀幣價格',
                    },
                    {
                      content: (
                        <>
                          <NumberFormatter number={~~x.bonusPrice} />
                        </>
                      ),
                      dataTitle: '紅利價格',
                    },
                    {
                      content: (
                        <>
                          <NumberFormatter number={~~x.stockQuantity} />
                        </>
                      ),
                      dataTitle: '庫存',
                    },
                    {
                      content: <>{getProductStatus(x.status)}</>,
                      dataTitle: '狀態',
                    },
                    {
                      content: <>{getCategoryName(x.categoryId)}</>,
                      dataTitle: '類別',
                    },
                    {
                      content: (
                        <>
                          <div className="productDataManagement__btns">
                            <button
                              className="productDataManagement__btn productDataManagement__btn--edit"
                              onClick={handleEdit(x)}
                            >
                              編輯
                            </button>
                            <button
                              className="productDataManagement__btn productDataManagement__btn--del"
                              onClick={() => handleDelete(x.productId)}
                            >
                              刪除
                            </button>
                            <button
                              className="productDataManagement__btn productDataManagement__btn--edit"
                              onClick={() => handlePDetail(x)}
                            >
                              查看商品
                            </button>
                            <button
                              className="productDataManagement__btn productDataManagement__btn--edit"
                              onClick={handleDuplicate(x)}
                            >
                              複製商品
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
