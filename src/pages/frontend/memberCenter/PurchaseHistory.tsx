import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import MemberCenterCoins from '@/components/frontend/memberCenter/MemberCenterCoins';
import DateFormatter from '@/components/common/DateFormatter';
import NumberFormatter from '@/components/common/NumberFormatter';
import NoData from '@/components/frontend/NoData';
import { getTransactions } from '@/services/frontend/transactionService';
import { useLoading } from '@/context/frontend/LoadingContext';
import { usePagination } from '@/hooks/usePagination';
import Pagination from '@/components/frontend/Pagination';

const transactionTypeMapping: { [key: string]: string } = {
  DEPOSIT: '儲值',
  CONSUME: '消費',
};

const PurchaseHistory: React.FC = () => {
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
      const { success, data } = await getTransactions(values);
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
              <label htmlFor="startDate" className="memberCenter__text">
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
                htmlFor="endDate"
                className="memberCenter__text memberCenter__text--required"
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
                  <th className="w-30">交易時間</th>
                  <th className="w-40">項目</th>
                  <th className="w-30">交易金額</th>
                </tr>
              </thead>
              <tbody>
                {pagination.currentPageItems.map((order: any) => (
                  <tr key={order.id}>
                    <td>
                      <DateFormatter
                        date={order.transactionDate}
                        format="YYYY/MM/DD"
                      />
                    </td>
                    <td>{transactionTypeMapping[order.transactionType]}</td>
                    <td>
                      <NumberFormatter number={order.amount ?? 0} />
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

export default PurchaseHistory;
