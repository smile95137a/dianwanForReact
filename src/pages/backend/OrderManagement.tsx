import React, { useEffect, useState } from 'react';
import BTable from '@/components/backend/btable/BTable';
import BTableRow from '@/components/backend/btable/BTableRow';
import NoData from '@/components/backend/NoData';
import Pagination from '@/components/backend/Pagination';
import Card from '@/components/frontend/MCard';
import { usePagination } from '@/hooks/usePagination';

import DateFormatter from '@/components/common/DateFormatter';
import { useLoading } from '@/context/frontend/LoadingContext';
import {
  getAllOrder,
  updateOrderResultStatus,
} from '@/services/backend/OrderService';
import NumberFormatter from '@/components/common/NumberFormatter';
import MButton from '@/components/backend/MButton';
import { useBackendDialog } from '@/context/backend/useBackendDialog';
import { getShippingMethodName } from '@/enums/ShippingMethod';

const OrderManagement = () => {
  const [orderList, setOrderList] = useState<any[]>([]);
  const [filteredList, setFilteredList] = useState<any[]>([]);
  const [filter, setFilter] = useState<
    'ALL' | 'SHIPPED' | 'PREPARING_SHIPMENT' | 'NO_PAY'
  >('ALL');

  const pagination = usePagination({
    list: filteredList,
    pageLimitSize: 10,
    initialPage: 1,
  });

  const { setLoading } = useLoading();
  const {
    openOrderDetailsDialog,
    openOrderShipmentDialog,
    openCreateShippingOrderDialog,
  } = useBackendDialog();

  useEffect(() => {
    fetchOrderList();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filter, orderList]);

  const fetchOrderList = async () => {
    try {
      setLoading(true);
      const { success, data, message } = await getAllOrder();
      setLoading(false);
      if (success) {
        setOrderList(data);
      } else {
        console.log(message);
      }
    } catch (error) {
      setLoading(false);
      console.error('獲取商品列表失敗：', error);
    }
  };

  const applyFilters = () => {
    let updatedList = orderList;

    if (filter !== 'ALL') {
      updatedList = orderList.filter((order) => order.resultStatus === filter);
    }
    console.log(updatedList);

    setFilteredList(updatedList);
  };

  const availableStatuses = (currentStatus: string) => {
    const allStatuses = [
      { value: 'PREPARING_SHIPMENT', label: '準備發貨' },
      { value: 'SHIPPED', label: '已發貨' },
      { value: 'SOLD_OUT', label: '售罄' },
      { value: 'NO_PAY', label: '未付款' },
      { value: 'FAILED_PAYMENT', label: '付款失敗' },
    ];
    if (['NO_PAY', 'FAILED_PAYMENT'].includes(currentStatus)) {
      return allStatuses.filter((status) => status.value === currentStatus);
    }
    return allStatuses.filter((status) =>
      ['PREPARING_SHIPMENT', 'SHIPPED'].includes(status.value)
    );
  };

  const handleStatusChange = async (order: any, newStatus: string) => {
    try {
      setLoading(true);
      const { success, message } = await updateOrderResultStatus(
        order.id,
        newStatus
      );
      setLoading(false);
      if (success) {
        const updatedOrders = orderList.map((o) =>
          o.id === order.id ? { ...o, resultStatus: newStatus } : o
        );
        setOrderList(updatedOrders);
      } else {
        console.error(message);
      }
    } catch (error) {
      setLoading(false);
      console.error('更新訂單狀態失敗：', error);
    }
  };

  const handleOrderDetails = (order: any) => {
    openOrderDetailsDialog(order);
  };

  const handleOrderShipmentDialog = async (order: any) => {
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.style.display = 'none'; // 隐藏 root
    }
    await openOrderShipmentDialog(order);
    if (rootElement) {
      rootElement.style.display = ''; // 恢复显示 root
    }
  };
  const handleCreateShippingOrder = (order: any) => {
    openCreateShippingOrderDialog(order);
  };

  return (
    <div className="orderManagement">
      <p className="orderManagement__title">訂單管理</p>

      {/* Filter Buttons */}
      <div className="orderManagement__filter gap-x-12">
        <button
          className={`orderManagement__filter-btn ${
            filter === 'ALL' ? 'active' : ''
          }`}
          onClick={() => setFilter('ALL')}
        >
          全部訂單
        </button>
        <button
          className={`orderManagement__filter-btn ${
            filter === 'SHIPPED' ? 'active' : ''
          }`}
          onClick={() => setFilter('SHIPPED')}
        >
          已發貨
        </button>
        <button
          className={`orderManagement__filter-btn ${
            filter === 'PREPARING_SHIPMENT' ? 'active' : ''
          }`}
          onClick={() => setFilter('PREPARING_SHIPMENT')}
        >
          未發貨
        </button>
        <button
          className={`orderManagement__filter-btn ${
            filter === 'NO_PAY' ? 'active' : ''
          }`}
          onClick={() => setFilter('NO_PAY')}
        >
          未付款
        </button>
      </div>

      <div className="orderManagement__list">
        {filteredList.length > 0 ? (
          <div className="orderManagement__list-content">
            <BTable
              headers={[
                { text: '訂單編號', className: '' },
                { text: '收件人姓名', className: '' },
                { text: '訂單狀態', className: '' },
                { text: '總金額', className: '' },
                { text: '運送方式', className: '' },
                { text: '運費', className: '' },
                { text: '出貨總數', className: '' },
                { text: '創建時間', className: '' },
                { text: '操作', className: '' },
              ]}
            >
              {pagination.currentPageItems.map((order, index) => (
                <BTableRow
                  key={index}
                  data={[
                    {
                      content: <>{order.orderNumber}</>,
                      dataTitle: '訂單編號',
                    },
                    {
                      content: <>{order.billingName}</>,
                      dataTitle: '收件人姓名',
                    },
                    {
                      content: (
                        <>
                          <select
                            value={order.resultStatus}
                            onChange={(e) =>
                              handleStatusChange(order, e.target.value)
                            }
                            className="status-select"
                          >
                            {availableStatuses(order.resultStatus).map(
                              (status) => (
                                <option key={status.value} value={status.value}>
                                  {status.label}
                                </option>
                              )
                            )}
                          </select>
                        </>
                      ),
                      dataTitle: '訂單狀態',
                    },
                    {
                      content: (
                        <>
                          <NumberFormatter number={order.totalAmount} />
                        </>
                      ),
                      dataTitle: '總金額',
                    },
                    {
                      content: (
                        <>{getShippingMethodName(order.shippingMethod)}</>
                      ),
                      dataTitle: '運送方式',
                    },
                    {
                      content: (
                        <>
                          <NumberFormatter number={order.shippingCost} />
                        </>
                      ),
                      dataTitle: '運費',
                    },
                    {
                      content: (
                        <>
                          <NumberFormatter number={order.orderCount} />
                        </>
                      ),
                      dataTitle: '出貨總數',
                    },
                    {
                      content: (
                        <>
                          <DateFormatter date={order.createdAt} />
                        </>
                      ),
                      dataTitle: '創建時間',
                    },
                    {
                      content: (
                        <div className="flex gap-12 flex-column">
                          <MButton
                            text={'查看訂單明細'}
                            click={() => handleOrderDetails(order)}
                          />
                          <MButton
                            text={'出貨單'}
                            click={() => handleOrderShipmentDialog(order)}
                          />
                          <MButton
                            text={'建立物流訂單'}
                            click={() => handleCreateShippingOrder(order)}
                          />
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
          <Card>
            <NoData />
          </Card>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
