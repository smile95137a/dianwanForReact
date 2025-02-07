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
import Pagination from '@/components/backend/Pagination';
import NoData from '@/components/frontend/NoData';

const reportNameMap: { [key: string]: string } = {
  DRAW_AMOUNT: '開獎金額報表',
  TOTAL_CONSUMPTION: '消費總額報表',
  TOTAL_DEPOSIT: '儲值總額報表',
  USER_UPDATE_LOG: '發放點數紅利報表',
  DAILY_SIGN_IN: '每日簽到報表',
  SLIVER_COIN_RECYCLE: '點數回收報表',
  PRIZE_RECYCLE_REPORT: '獎品回收報表',
  DRAW_RESULT_SUMMARY: '開獎結果報表',
};

const isImage = (value: any) => {
  if (typeof value !== 'string') return false;
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
  return imageExtensions.some((ext) => value.toLowerCase().includes(ext));
};

const getFormattedImageUrl = (url: string) => {
  const BASE_IMAGE_URL = process.env.REACT_APP_IMAGE_API_URL || '';
  return `${BASE_IMAGE_URL}/img/${url}`;
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
      const response = await exportReportData(
        params.reportType,
        params.startDate,
        params.endDate,
        params.groupType
      );

      const reportName = reportNameMap[params.reportType] || params.reportType;
      const url = window.URL.createObjectURL(new Blob([response.data]));
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
      const data = await fetchReportData(
        params.reportType,
        params.startDate,
        params.endDate,
        params.groupType
      );
      setList(data || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('查詢報表失敗:', error);
    }
  };

  const renderTable = () => {
    if (list.length === 0) {
      return <NoData />;
    }

    return (
      <table>
        <thead>
          <tr>
            {Object.keys(list[0]).map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pagination.currentPageItems.map((row, index) => (
            <tr key={index}>
              {Object.entries(row).map(([key, value]) => (
                <td key={key}>
                  {isImage(value) ? (
                    <img
                      src={getFormattedImageUrl(value)}
                      alt="圖片"
                      className="product-image"
                    />
                  ) : (
                    value
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="vendorManagement">
      <Card>
        <div className="p-24">
          <p className="vendorManagement__title">報表金額管理</p>

          <div className="flex">
            <div className="w-100 p-12">
              <FormSelect
                name="reportType"
                control={control}
                label="選擇報表"
                options={Object.keys(reportNameMap).map((key) => ({
                  value: key,
                  label: reportNameMap[key],
                }))}
              />
            </div>
          </div>

          <div className="flex">
            <div className="w-100 p-12">
              <FormSelect
                name="groupType"
                control={control}
                label="分組類型"
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
            <div className="w-50 p-12">
              <FormInput
                name="startDate"
                control={control}
                type="date"
                label="開始日期"
                placeholder="選擇開始日期"
              />
            </div>
            <div className="w-50 p-12">
              <FormInput
                name="endDate"
                control={control}
                type="date"
                label="結束日期"
                placeholder="選擇結束日期"
              />
            </div>
          </div>
          <div className="vendorManagement__btns">
            <MButton text="查詢報表" click={handleSubmit} />
            <MButton text="匯出 Excel" click={exportToExcel} />
          </div>
        </div>
      </Card>

      {/* 表格與分頁 */}
      <div className="vendorManagement__list">
        {renderTable()}
        {list.length > 0 && <Pagination {...pagination} />}
      </div>
    </div>
  );
};

export default VendorManagement;
