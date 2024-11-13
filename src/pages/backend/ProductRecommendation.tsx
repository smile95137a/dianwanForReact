import BTable from '@/components/backend/btable/BTable';
import BTableRow from '@/components/backend/btable/BTableRow';
import NoData from '@/components/backend/NoData';
import Pagination from '@/components/backend/Pagination';
import Card from '@/components/frontend/MCard';
import { usePagination } from '@/hooks/usePagination';
import { getAllRecommendationMappings } from '@/services/backend/RecommendationService';
import DateFormatter from '@/components/common/DateFormatter';
import React, { useEffect, useState } from 'react';
import { useBackendDialog } from '@/context/backend/useBackendDialog';

const ProductRecommendation = () => {
  const { openAddProductRecommendationDialog } = useBackendDialog();

  const [mappingList, setMappingList] = useState<any[]>([]);

  const pagination = usePagination({
    list: mappingList,
    pageLimitSize: 10,
    initialPage: 1,
  });

  useEffect(() => {
    fetchMappings();
  }, []);

  const fetchMappings = async () => {
    try {
      const { success, data } = await getAllRecommendationMappings();
      if (success) {
        setMappingList(data);
      }
    } catch (err) {
      console.error('Error fetching recommendation mappings:', err);
    }
  };

  const openProductRecommendation = async () => {
    const result = await openAddProductRecommendationDialog();
    console.log(result);
  };

  return (
    <div className="recommendationMappingManagement">
      <p className="recommendationMappingManagement__title">推薦系列管理</p>
      <button
        className="recommendationMappingManagement__addButton"
        onClick={openProductRecommendation}
      >
        新增推薦系列
      </button>
      <div className="recommendationMappingManagement__list">
        {mappingList.length > 0 ? (
          <div className="recommendationMappingManagement__list-content">
            <BTable
              headers={[
                { text: '圖片', className: '' },
                { text: '商品名稱', className: '' },
                { text: '類別名稱', className: '' },
                { text: '創造時間', className: '' },
                { text: '操作', className: '' },
              ]}
            >
              {pagination.currentPageItems.map((recommand, index) => (
                <BTableRow
                  key={index}
                  data={[
                    {
                      content: (
                        <img
                          src={recommand.imageUrl}
                          alt={recommand.productName}
                        />
                      ),
                      dataTitle: '圖片',
                    },
                    {
                      content: <>{recommand.productName}</>,
                      dataTitle: '商品名稱',
                    },
                    {
                      content: (
                        <>{recommand.recommendationName || '未設置類別'}</>
                      ),
                      dataTitle: '類別名稱',
                    },
                    {
                      content: <DateFormatter date={recommand.createdAt} />,
                      dataTitle: '創造時間',
                    },
                    {
                      content: (
                        <button className="recommendationMappingManagement__btn">
                          編輯
                        </button>
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
          <Card content={<NoData />} />
        )}
      </div>
    </div>
  );
};

export default ProductRecommendation;
