import BTable from '@/components/backend/btable/BTable';
import BTableRow from '@/components/backend/btable/BTableRow';
import NoData from '@/components/backend/NoData';
import Pagination from '@/components/backend/Pagination';
import Card from '@/components/frontend/MCard';
import { usePagination } from '@/hooks/usePagination';
import {
  getAllRedemptionCodes,
  generateRedemptionCode,
  RedemptionCode,
} from '@/services/backend/RedemptionService';
import React, { useEffect, useState } from 'react';

const RedemptionCodeList = () => {
  const [codeList, setCodeList] = useState<RedemptionCode[]>([]);

  const pagination = usePagination({
    list: codeList,
    pageLimitSize: 10,
    initialPage: 1,
  });

  useEffect(() => {
    fetchCodes();
  }, []);

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
    try {
      const { success, data } = await generateRedemptionCode();
      if (success) {
        fetchCodes();
      }
    } catch (err) {
      console.error('Error generating redemption code:', err);
    }
  };

  return (
    <div className="redemptionCodeManagement">
      <p className="redemptionCodeManagement__title">兌換碼列表</p>

      {/* Button to generate a new redemption code */}
      <button
        onClick={handleGenerateCode}
        className="redemptionCodeManagement__btn"
      >
        生成新的兌換碼
      </button>

      <div className="redemptionCodeManagement__list">
        {codeList.length > 0 ? (
          <div className="redemptionCodeManagement__list-content">
            <BTable
              headers={[
                { text: 'ID', className: '' },
                { text: '兌換碼', className: '' },
                { text: '已兌換', className: '' },
                { text: '兌換日期', className: '' },
                { text: '用戶 ID', className: '' },
                { text: '操作', className: '' },
              ]}
            >
              {pagination.currentPageItems.map((code, index) => (
                <BTableRow
                  key={index}
                  data={[
                    { content: <>{code.id}</>, dataTitle: 'ID' },
                    { content: <>{code.code}</>, dataTitle: '兌換碼' },
                    {
                      content: <>{code.isRedeemed ? '是' : '否'}</>,
                      dataTitle: '已兌換',
                    },
                    {
                      content: <>{code.redeemedAt || 'N/A'}</>,
                      dataTitle: '兌換日期',
                    },
                    {
                      content: <>{code.userId ? code.userId : '未指定'}</>,
                      dataTitle: '用戶 ID',
                    },
                    {
                      content: (
                        <button className="redemptionCodeManagement__btn">
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

export default RedemptionCodeList;
