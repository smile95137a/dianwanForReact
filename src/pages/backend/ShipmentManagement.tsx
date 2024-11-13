import BTable from '@/components/backend/btable/BTable';
import BTableRow from '@/components/backend/btable/BTableRow';
import NoData from '@/components/backend/NoData';
import Pagination from '@/components/backend/Pagination';
import NumberFormatter from '@/components/common/NumberFormatter';
import Card from '@/components/frontend/MCard';
import { usePagination } from '@/hooks/usePagination';
import { getAllShippingMethods } from '@/services/backend/ShipService';
import React, { useEffect, useState } from 'react';

const ShipmentManagement = () => {
  const [shippingMethodList, setShippingMethodList] = useState<
    ShippingMethod[]
  >([]);

  const pagination = usePagination({
    list: shippingMethodList,
    pageLimitSize: 10,
    initialPage: 1,
  });

  useEffect(() => {
    const fetchShippingMethods = async () => {
      try {
        const { success, data } = await getAllShippingMethods();
        if (success) {
          setShippingMethodList(data);
        }
      } catch (err) {
        console.error('Error fetching shipping methods:', err);
      }
    };

    fetchShippingMethods();
  }, []);

  return (
    <div className="shipmentManagement">
      <p className="shipmentManagement__title">運輸方式管理</p>

      <div className="shipmentManagement__list">
        {shippingMethodList.length > 0 && (
          <div className="shipmentManagement__list-content">
            <BTable
              headers={[
                { text: 'ID', className: '' },
                { text: '名稱', className: '' },
                { text: '描述', className: '' },
                { text: '狀態', className: '' },
                { text: '最小尺寸', className: '' },
                { text: '最大尺寸', className: '' },
                { text: '運費', className: '' },
                { text: '操作', className: '' },
              ]}
            >
              {pagination.currentPageItems.map((method, index) => (
                <BTableRow
                  key={index}
                  data={[
                    {
                      content: <>{method.shippingMethodId}</>,
                      dataTitle: '暱稱',
                    },
                    { content: <>{method.name}</>, dataTitle: '電話' },
                    {
                      content: <>{method.description}</>,
                      dataTitle: '居住地址',
                    },
                    { content: <>{method.status}</>, dataTitle: '金幣' },
                    {
                      content: (
                        <>
                          <NumberFormatter number={method.minSize} />
                        </>
                      ),
                      dataTitle: '銀幣',
                    },
                    {
                      content: (
                        <>
                          <NumberFormatter number={method.maxSize} />
                        </>
                      ),
                      dataTitle: '紅利點數',
                    },
                    {
                      content: (
                        <>
                          <NumberFormatter number={method.shippingPrice} />
                        </>
                      ),
                      dataTitle: '紅利點數',
                    },
                    {
                      content: (
                        <button className="shipmentManagement__btn">
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
        )}
        {shippingMethodList.length === 0 && <Card content={<NoData />} />}
      </div>
    </div>
  );
};

export default ShipmentManagement;
