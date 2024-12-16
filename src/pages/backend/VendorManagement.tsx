import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Card from '@/components/frontend/MCard';
import { FormInput } from '@/components/backend/FormInput';
import { FormSelect } from '@/components/backend/FormSelect';
import MButton from '@/components/backend/MButton';
import {
  exportReportData,
  fetchReportData,
} from '@/services/backend/StoreServices';
import { useLoading } from '@/context/frontend/LoadingContext';
import { usePagination } from '@/hooks/usePagination';
import BTable from '@/components/backend/btable/BTable';
import BTableRow from '@/components/backend/btable/BTableRow';
import DateFormatter from '@/components/common/DateFormatter';
import NumberFormatter from '@/components/common/NumberFormatter';
import NoData from '@/components/frontend/NoData';
import Pagination from '@/components/backend/Pagination';

const reportNameMap: { [key: string]: string } = {
  DRAW_AMOUNT: '開獎金額報表',
  TOTAL_CONSUMPTION: '消費總額報表',
  TOTAL_DEPOSIT: '儲值總額報表',
  USER_UPDATE_LOG: '發放銀幣紅利報表',
  DAILY_SIGN_IN: '每日簽到報表',
  SLIVER_COIN_RECYCLE: '銀幣回收報表',
  PRIZE_RECYCLE_REPORT: '獎品回收報表',
  DRAW_RESULT_SUMMARY: '開獎結果報表',
};

const VendorManagement = () => {
  const { setLoading } = useLoading();
  const [list, setList] = useState<any[]>([]);
  const { control, getValues } = useForm({
    defaultValues: {
      reportType: 'DRAW_AMOUNT',
      groupType: 'day',
      startDate: '',
      endDate: '',
    },
  });

  const pagination = usePagination({
    list,
    pageLimitSize: 10,
    initialPage: 1,
  });

  const exportToExcel = async () => {
    try {
      const params = getValues();

      const res = await exportReportData(
        params.reportType,
        params.startDate,
        params.endDate,
        params.groupType
      );

      // 获取中文名称
      const reportName = reportNameMap[params.reportType] || params.reportType;

      // 创建下载链接并触发下载
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportName}.xlsx`);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('匯出報表失敗:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const params = getValues();
      setLoading(true);
      const { success, data } = await fetchReportData(
        params.reportType,
        params.startDate,
        params.endDate,
        params.groupType
      );
      setLoading(false);
      if (success) {
        console.log('Data fetched successfully:', data);
        setList(data || []);
      } else {
        console.error('Failed to fetch report data');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching report data:', error);
    }
  };

  return (
    <div className="vendorManagement">
      <Card>
        <div className="p-24">
          <p className="vendorManagement__text vendorManagement__text--title">
            報表金額管理
          </p>

          <div className="vendorManagement__main">
            <div className="flex">
              <div className="w-100">
                <p className="vendorManagement__text">選擇報表:</p>
                <FormSelect
                  name="reportType"
                  control={control}
                  options={[
                    { value: 'DRAW_AMOUNT', label: '開獎金額報表' },
                    { value: 'TOTAL_CONSUMPTION', label: '消費總額報表' },
                    { value: 'TOTAL_DEPOSIT', label: '儲值總額報表' },
                    { value: 'USER_UPDATE_LOG', label: '發放銀幣紅利報表' },
                    { value: 'DAILY_SIGN_IN', label: '每日簽到報表' },
                    { value: 'SLIVER_COIN_RECYCLE', label: '銀幣回收報表' },
                    { value: 'PRIZE_RECYCLE_REPORT', label: '獎品回收報表' },
                    { value: 'DRAW_RESULT_SUMMARY', label: '開獎結果報表' },
                  ]}
                />
              </div>
            </div>

            <div className="flex">
              <div className="w-100">
                <p className="vendorManagement__text">分組類型：</p>
                <FormSelect
                  name="groupType"
                  control={control}
                  options={[
                    { value: 'day', label: '日' },
                    { value: 'week', label: '週' },
                    { value: 'month', label: '月' },
                    { value: 'year', label: '年' },
                  ]}
                />
              </div>
            </div>

            <div className="flex">
              <div className="w-100">
                <p className="vendorManagement__text">開始日期:</p>
                <FormInput
                  name="startDate"
                  control={control}
                  type="date"
                  placeholder="選擇開始日期"
                />
              </div>

              <div className="w-100">
                <p className="vendorManagement__text">結束日期:</p>
                <FormInput
                  name="endDate"
                  control={control}
                  type="date"
                  placeholder="選擇結束日期"
                />
              </div>
            </div>

            <div className="vendorManagement__btns">
              <MButton text={'查詢報表'} click={handleSubmit} />
              <MButton text={'匯出 Excel'} click={exportToExcel} />
            </div>
          </div>
        </div>
      </Card>

      <div className="vendorManagement__list">
        {list.length > 0 && (
          <div className="vendorManagement__list-content">
            <Pagination {...pagination} />
          </div>
        )}
        {/* {users.length === 0 && <Card content={<NoData />} />} */}
      </div>
    </div>
  );
};

export default VendorManagement;
