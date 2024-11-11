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
  const [bannerList, setBannerList] = useState<Banner[]>([]);

  const { openAddBannerDialog } = useBackendDialog();

  const pagination = usePagination({
    list: bannerList,
    pageLimitSize: 10,
    initialPage: 1,
    showPaginationPageNum: 5,
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

  return (
    <div className="bannerManagement">
      <p className="bannerManagement__title">橫幅管理</p>

      <button
        className="bannerManagement__addButton"
        onClick={openBannerDialog}
      >
        新增 Banner
      </button>
      <div className="bannerManagement__list">
        {bannerList.length > 0 ? (
          <div className="bannerManagement__list-content">
            <BTable
              headers={[
                { text: '標題', className: '' },
                { text: '預覽', className: '' },
                { text: '發布日期', className: '' },
                { text: '狀態', className: '' },
                { text: '操作', className: '' },
              ]}
            >
              {pagination.currentPageItems.map((banner, index) => (
                <BTableRow
                  key={index}
                  data={[
                    { content: <>{banner.title}</>, dataTitle: '標題' },
                    {
                      content: <>{banner.preview || '無預覽'}</>,
                      dataTitle: '預覽',
                    },
                    {
                      content: (
                        <>
                          <DateFormatter date={banner.publishDate} />
                        </>
                      ),
                      dataTitle: '發布日期',
                    },
                    {
                      content: (
                        <>
                          {banner.status === BannerStatus.AVAILABLE
                            ? '已發布'
                            : '未發布'}
                        </>
                      ),
                      dataTitle: '狀態',
                    },
                    {
                      content: (
                        <button className="bannerManagement__btn">編輯</button>
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
