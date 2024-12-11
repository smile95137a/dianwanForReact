import BTable from '@/components/backend/btable/BTable';
import BTableRow from '@/components/backend/btable/BTableRow';
import NoData from '@/components/backend/NoData';
import Pagination from '@/components/backend/Pagination';
import DateFormatter from '@/components/common/DateFormatter';
import Card from '@/components/frontend/MCard';
import { useBackendDialog } from '@/context/backend/useBackendDialog';
import { usePagination } from '@/hooks/usePagination';
import {
  Banner,
  BannerStatus,
  getAllBanners,
} from '@/services/backend/BannerService';
import React, { useEffect, useState } from 'react';

const BannerManagement = () => {
  const statusOptions = [
    { value: 'AVAILABLE', label: '啟用' },
    { value: 'UNAVAILABLE', label: '停用' },
  ];

  const productTypeOptions = [
    { value: 'PRIZE', label: '一番賞' },
    { value: 'GACHA', label: '扭蛋' },
    { value: 'BLIND_BOX', label: '盲盒' },
  ];

  const [bannerList, setBannerList] = useState<Banner[]>([]);

  const { openAddBannerDialog } = useBackendDialog();

  const pagination = usePagination({
    list: bannerList,
    pageLimitSize: 10,
    initialPage: 1,
  });

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { success, data } = await getAllBanners();
        if (success) {
          setBannerList(data);
        }
      } catch (err) {
        console.error('Error fetching banners:', err);
      }
    };

    fetchBanners();
  }, []);

  const openBannerDialog = async () => {
    const result = await openAddBannerDialog();
    console.log(result);
  };

  const getStatusLabel = (status: any) => {
    return (
      statusOptions.find((option) => option.value === status)?.label || status
    );
  };

  const getProductTypeLabel = (type: any) => {
    return (
      productTypeOptions.find((option) => option.value === type)?.label || type
    );
  };

  return (
    <div className="bannerManagement">
      <p className="bannerManagement__title">橫幅管理</p>

      <button
        className="bannerManagement__btn m-b-12"
        onClick={openBannerDialog}
      >
        新增 Banner
      </button>
      <div className="bannerManagement__list">
        {bannerList.length > 0 ? (
          <div className="bannerManagement__list-content">
            <BTable
              headers={[
                { text: 'ID', className: '' },
                { text: '狀態', className: '' },
                { text: '發布日期', className: '' },
                { text: '產品 ID', className: '' },
                { text: '操作', className: '' },
              ]}
            >
              {pagination.currentPageItems.map((banner, index) => (
                <BTableRow
                  key={index}
                  data={[
                    { content: <>{banner.bannerId}</>, dataTitle: 'ID' },
                    {
                      content: <>{getStatusLabel(banner.status)}</>,
                      dataTitle: '預覽',
                    },
                    {
                      content: <>{getProductTypeLabel(banner.productType)}</>,
                      dataTitle: '發布日期',
                    },
                    {
                      content: <>{banner.productId}</>,
                      dataTitle: '狀態',
                    },
                    {
                      content: (
                        <button className="bannerManagement__btn">刪除</button>
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

export default BannerManagement;
