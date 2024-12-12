import BTable from '@/components/backend/btable/BTable';
import BTableRow from '@/components/backend/btable/BTableRow';
import NoData from '@/components/backend/NoData';
import Pagination from '@/components/backend/Pagination';
import Card from '@/components/frontend/MCard';
import { usePagination } from '@/hooks/usePagination';
import {
  deleteRecommendationMapping,
  getAllRecommendationMappings,
} from '@/services/backend/RecommendationService';
import DateFormatter from '@/components/common/DateFormatter';
import React, { useEffect, useState } from 'react';
import { useBackendDialog } from '@/context/backend/useBackendDialog';
import { useLoading } from '@/context/frontend/LoadingContext';
import { deleteShippingMethod } from '@/services/backend/ShipService';

const ProductRecommendation = () => {
  const [mappingList, setMappingList] = useState<any[]>([]);
  const {
    openAddProductRecommendationDialog,
    openConfirmDialog,
    openInfoDialog,
  } = useBackendDialog();
  const { setLoading } = useLoading();

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
    if (result) {
      fetchMappings();
    }
  };

  const handleEdit = (data: any) => async () => {
    const result = await openAddProductRecommendationDialog(true, data);
    if (result) {
      fetchMappings();
    }
  };

  const handleDelete = async (id: number) => {
    const result = await openConfirmDialog('系統提示', '確定要刪除嗎？');

    if (result) {
      try {
        setLoading(true);
        const { success } = await deleteRecommendationMapping(id);
        setLoading(false);
        if (success) {
          await openInfoDialog('系統提示', '已成功刪除！');
          fetchMappings();
        } else {
          await openInfoDialog('系統提示', '刪除失敗，請稍後再試！');
        }
      } catch (error) {
        setLoading(false);
        console.error('Error deleting banner:', error);
        await openInfoDialog('系統提示', '刪除失敗，請稍後再試！');
      }
    }
  };

  return (
    <div className="recommendationMappingManagement">
      <p className="recommendationMappingManagement__title">推薦系列管理</p>
      <button
        className="recommendationMappingManagement__btn m-b-12"
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
                        <div className="recommendationMappingManagement__btns">
                          <button
                            className="recommendationMappingManagement__btn"
                            onClick={handleEdit(recommand)}
                          >
                            編輯
                          </button>
                          <button
                            className="recommendationMappingManagement__btn"
                            onClick={() => handleDelete(recommand.id)}
                          >
                            刪除
                          </button>
                        </div>
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
