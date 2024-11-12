import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import MemberCenterCoins from '@/components/frontend/memberCenter/MemberCenterCoins';
import DateFormatter from '@/components/common/DateFormatter';
import NumberFormatter from '@/components/common/NumberFormatter';
import NoData from '@/components/frontend/NoData';

const transactionTypeMapping: { [key: string]: string } = {
  DEPOSIT: '儲值',
  CONSUME: '消費',
};

const mapTransactionType = (type: string) => {
  return transactionTypeMapping[type] || type;
};

// Inline mock data for testing
const mockTransactions = [
  {
    id: '1',
    transactionDate: '2023-01-15',
    transactionType: 'DEPOSIT',
    amount: 1000,
  },
  {
    id: '2',
    transactionDate: '2023-02-20',
    transactionType: 'CONSUME',
    amount: -500,
  },
  {
    id: '3',
    transactionDate: '2023-03-10',
    transactionType: 'DEPOSIT',
    amount: 2000,
  },
  {
    id: '4',
    transactionDate: '2023-04-05',
    transactionType: 'CONSUME',
    amount: -100,
  },
];

interface TransactionRecord {
  id: string;
  transactionDate: string;
  transactionType: string;
  amount: number;
}

const PurchaseHistory: React.FC = () => {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      startDate: '',
      endDate: '',
    },
  });

  const [records, setRecords] = useState<TransactionRecord[]>(mockTransactions); // Use mock data initially

  const onSubmit = (values: { startDate: string; endDate: string }) => {
    // For testing purposes, we skip the API call and use mock data
    setRecords(mockTransactions);
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
              <p className="memberCenter__text">起始時間</p>
              <input
                type="date"
                {...register('startDate')}
                className="memberCenter__orderHistoryForm-form-input"
              />
            </div>
          </div>
          <div className="memberCenter__orderHistoryForm-box">
            <div className="memberCenter__orderHistoryForm-form-inputs m-t-20">
              <p className="memberCenter__text memberCenter__text--required">
                結束時間
              </p>
              <input
                type="date"
                {...register('endDate')}
                className="memberCenter__orderHistoryForm-form-input"
              />
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
              {records.map((order) => (
                <tr key={order.id}>
                  <td>
                    <DateFormatter
                      date={order.transactionDate}
                      format="YYYY/MM/DD"
                    />
                  </td>
                  <td>{mapTransactionType(order.transactionType)}</td>
                  <td>
                    <NumberFormatter number={order.amount ?? 0} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PurchaseHistory;
