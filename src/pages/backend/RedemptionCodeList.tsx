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

const RedemptionCodeList = () => {
  const [codeList, setCodeList] = useState<any[]>([]);
  const [filteredCodes, setFilteredCodes] = useState<any[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'REDEEMED' | 'NOT_REDEEMED'>(
    'ALL'
  );
  const [selectedProduct, setSelectedProduct] = useState<string>('全部');
  const [products, setProducts] = useState<any[]>([]);

  const pagination = usePagination({
    list: filteredCodes,
    pageLimitSize: 10,
    initialPage: 1,
  });

  const { openAddRedemptionCodeDialog } = useBackendDialog();

  useEffect(() => {
    fetchProductList();
    fetchCodes();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filter, selectedProduct, codeList]);

  const fetchProductList = async () => {
    try {
      const { success, data, message } = await getAllProductsByType(
        'CUSTMER_PRIZE'
      );
      if (success) {
        const filteredProducts = data.filter(
          (product) =>
            product.status === 'AVAILABLE' ||
            product.status === 'NOT_AVAILABLE_YET'
        );
        setProducts(filteredProducts);
      } else {
        console.log(message);
      }
    } catch (error) {
      console.error('獲取商品列表失敗：', error);
    }
  };

  const fetchCodes = async () => {
    try {
      const { success, data } = await getAllRedemptionCodes();
      if (success) {
        setCodeList(data);
      }
    } catch (err) {
      console.error('Error fetching redemption codes:', err);
    }
  };

  const handleGenerateCode = async () => {
    openAddRedemptionCodeDialog();
  };
  const applyFilters = () => {
    let codes = [...codeList];

    if (selectedProduct && selectedProduct !== '全部') {
      codes = codes.filter(
        (code) => code.productId === Number(selectedProduct)
      );
    }

    if (filter === 'REDEEMED') {
      codes = codes.filter((code) => code.isRedeemed);
    } else if (filter === 'NOT_REDEEMED') {
      codes = codes.filter((code) => !code.isRedeemed);
    }

    setFilteredCodes(codes);
  };
  return (
    <div className="redemptionCodeManagement">
      <p className="redemptionCodeManagement__title">兌換碼列表</p>

      <button
        onClick={handleGenerateCode}
        className="redemptionCodeManagement__btn m-b-12"
      >
        生成新的兌換碼
      </button>

      {/* Filter Buttons */}
      <div className="redemptionCodeManagement__filter gap-x-12">
        <button
          className={`redemptionCodeManagement__filter-btn ${
            filter === 'ALL' ? 'active' : ''
          }`}
          onClick={() => setFilter('ALL')}
        >
          全部
        </button>
        <button
          className={`redemptionCodeManagement__filter-btn ${
            filter === 'REDEEMED' ? 'active' : ''
          }`}
          onClick={() => setFilter('REDEEMED')}
        >
          已兌換
        </button>
        <button
          className={`redemptionCodeManagement__filter-btn ${
            filter === 'NOT_REDEEMED' ? 'active' : ''
          }`}
          onClick={() => setFilter('NOT_REDEEMED')}
        >
          未兌換
        </button>
      </div>
      <div className="redemptionCodeManagement__productFilter">
        篩選產品：
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
        >
          <option value="全部">全部</option>
          {products.map((product) => (
            <option key={product.productId} value={product.productId}>
              {product.productName}
            </option>
          ))}
        </select>
      </div>

      <div className="redemptionCodeManagement__list">
        {filteredCodes.length > 0 ? (
          <div className="redemptionCodeManagement__list-content">
            <BTable
              headers={[
                { text: '兌換碼', className: '' },
                { text: '已兌換', className: '' },
                { text: '兌換日期', className: '' },
                { text: '用戶 ID', className: '' },
                { text: '產品', className: '' },
              ]}
            >
              {pagination.currentPageItems.map((code, index) => (
                <BTableRow
                  key={index}
                  data={[
                    { content: <>{code.code}</>, dataTitle: '兌換碼' },
                    {
                      content: <>{code.isRedeemed ? '是' : '否'}</>,
                      dataTitle: '已兌換',
                    },
                    {
                      content: (
                        <>
                          {code.redeemedAt ? (
                            <DateFormatter date={code.redeemedAt} />
                          ) : (
                            '尚未兌換'
                          )}
                        </>
                      ),
                      dataTitle: '兌換日期',
                    },
                    {
                      content: <>{code.userId ? code.userId : '未指定'}</>,
                      dataTitle: '用戶 ID',
                    },
                    {
                      content: (
                        <>{code.productName ? code.productName : '未指定'}</>
                      ),
                      dataTitle: '指定產品',
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

export default RedemptionCodeList;
