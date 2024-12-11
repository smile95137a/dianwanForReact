import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import MemberCenterCoins from '@/components/frontend/memberCenter/MemberCenterCoins';
import DateFormatter from '@/components/common/DateFormatter';
import NumberFormatter from '@/components/common/NumberFormatter';
import NoData from '@/components/frontend/NoData';
import { useLoading } from '@/context/frontend/LoadingContext';
import { usePagination } from '@/hooks/usePagination';
import { queryOrder } from '@/services/frontend/orderService';
import Pagination from '@/components/frontend/Pagination';

const transactionTypeMapping: { [key: string]: string } = {
  DEPOSIT: '儲值',
  CONSUME: '消費',
};

const mapTransactionType = (type: string) => {
  return transactionTypeMapping[type] || type;
};

const OrderHistory: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      startDate: '',
      endDate: '',
    },
  });

  const { setLoading } = useLoading();
  const [records, setRecords] = useState<any>([]);
  const pagination = usePagination({
    list: records,
    pageLimitSize: 10,
    initialPage: 1,
  });
  const onSubmit = async (values: any) => {
    try {
      setLoading(true);
      const { success, data } = await queryOrder(values);
      setLoading(false);
      if (success) {
        setRecords(data);
      } else {
        console.error('Failed to fetch transactions');
        setRecords([]);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setRecords([]);
    }
  };

  const handleDetailClick = (order: any) => {
    console.log('Order Detail:', order);
  };

  return (
    <div className="memberCenter__orderHistory">
      <MemberCenterCoins />
      <div className="memberCenter__orderHistoryForm">
        <div className="memberCenter__orderHistoryForm-title">
          <p className="memberCenter__text">消費紀錄</p>
        </div>
        <form
          className="memberCenter__orderHistoryForm-main"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="memberCenter__orderHistoryForm-box">
            <div className="memberCenter__orderHistoryForm-form-inputs m-t-20">
              <label className="memberCenter__text" htmlFor="startDate">
                起始時間
              </label>
              <input
                id="startDate"
                type="date"
                {...register('startDate')}
                className={`memberCenter__orderHistoryForm-form-input ${
                  errors.startDate ? 'input-error' : ''
                }`}
              />
              {errors.startDate && (
                <span className="error-text">{errors.startDate.message}</span>
              )}
            </div>
          </div>
          <div className="memberCenter__orderHistoryForm-box">
            <div className="memberCenter__orderHistoryForm-form-inputs m-t-20">
              <label
                className="memberCenter__text memberCenter__text--required"
                htmlFor="endDate"
              >
                結束時間
              </label>
              <input
                id="endDate"
                type="date"
                {...register('endDate')}
                className={`memberCenter__orderHistoryForm-form-input ${
                  errors.endDate ? 'input-error' : ''
                }`}
              />
              {errors.endDate && (
                <span className="error-text">{errors.endDate.message}</span>
              )}
            </div>
          </div>
          <div className="memberCenter__orderHistoryForm-box memberCenter__orderHistoryForm-box--btns">
            <div className="memberCenter__orderHistoryForm-btns">
              <button
                type="submit"
                className="memberCenter__orderHistoryForm-btn"
              >
                <span className="memberCenter__text">查詢</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {records.length === 0 ? (
        <NoData />
      ) : (
        <>
          <div className="memberCenter__table">
            <table>
              <thead>
                <tr>
                  <th className="w-25">日期</th>
                  <th className="w-25">訂單編號</th>
                  <th className="w-25">內容</th>
                  <th className="w-25">狀態</th>
                  <th className="w-25">明細</th>
                </tr>
              </thead>
              <tbody>
                {pagination.currentPageItems.map((order: any) => (
                  <tr key={order.id}>
                    <td>
                      <DateFormatter
                        date={order.createdAt}
                        format="YYYY/MM/DD"
                      />
                    </td>
                    <td>{order.orderNumber}</td>
                    <td>{order.content}</td>
                    <td>{order.resultStatus}</td>

                    <td>
                      <button
                        className="detail-btn"
                        onClick={() => handleDetailClick(order)}
                      >
                        明細
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {records.length > 0 && (
            <>
              <Pagination {...pagination} />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default OrderHistory;
