import BTable from '@/components/backend/btable/BTable';
import BTableRow from '@/components/backend/btable/BTableRow';
import NoData from '@/components/backend/NoData';
import Pagination from '@/components/backend/Pagination';
import Card from '@/components/frontend/MCard';
import { usePagination } from '@/hooks/usePagination';
import { getAllOrder } from '@/services/backend/VendorService';
import React, { useEffect, useState } from 'react';

const VendorManagement = () => {
  const [orderList, setOrderList] = useState<VendorOrderEntity[]>([]);

  const pagination = usePagination({
    list: orderList,
    pageLimitSize: 10,
    initialPage: 1,
    showPaginationPageNum: 5,
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { success, data } = await getAllOrder();
        if (success) {
          setOrderList(data);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="vendorManagement">
      <p className="vendorManagement__title">所有廠商訂單</p>

      <div className="vendorManagement__list">
        {orderList.length > 0 ? (
          <div className="vendorManagement__list-content">
            <BTable
              headers={[
                { text: '廠商訂單編號', className: '' },
                { text: '訂單編號', className: '' },
                { text: '訊息代碼', className: '' },
                { text: '訊息內容', className: '' },
                { text: '快遞公司', className: '' },
                { text: '狀態', className: '' },
                { text: '操作', className: '' },
              ]}
            >
              {pagination.currentPageItems.map((order, index) => (
                <BTableRow
                  key={index}
                  data={[
                    {
                      content: <>{order.vendorOrder}</>,
                      dataTitle: '廠商訂單編號',
                    },
                    { content: <>{order.orderNo}</>, dataTitle: '訂單編號' },
                    { content: <>{order.errorCode}</>, dataTitle: '訊息代碼' },
                    {
                      content: <>{order.errorMessage}</>,
                      dataTitle: '訊息內容',
                    },
                    { content: <>{order.express}</>, dataTitle: '快遞公司' },
                    { content: <>{order.status}</>, dataTitle: '狀態' },
                    {
                      content: (
                        <button className="vendorManagement__btn">編輯</button>
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

export default VendorManagement;
