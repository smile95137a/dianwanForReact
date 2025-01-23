import BTable from '@/components/backend/btable/BTable';
import BTableRow from '@/components/backend/btable/BTableRow';
import NoData from '@/components/backend/NoData';
import Pagination from '@/components/backend/Pagination';
import DateFormatter from '@/components/common/DateFormatter';
import Card from '@/components/frontend/MCard';
import { useBackendDialog } from '@/context/backend/useBackendDialog';
import { useLoading } from '@/context/frontend/LoadingContext';
import { usePagination } from '@/hooks/usePagination';
import {
  Banner,
  deleteBanner,
  getAllBanners,
} from '@/services/backend/BannerService';
import { getImageUrl } from '@/utils/ImageUtils';
import React, { useEffect, useState } from 'react';

const BannerManagement = () => {
  const statusOptions = [
    { value: 'AVAILABLE', label: '啟用' },
    { value: 'UNAVAILABLE', label: '停用' },
  ];

  const productTypeOptions = [
    { value: 'PRIZE', label: '電玩賞' },
    { value: 'GACHA', label: '扭蛋' },
    { value: 'BLIND_BOX', label: '盲盒' },
  ];

  const [bannerList, setBannerList] = useState<Banner[]>([]);

  const { openInfoDialog, openAddBannerDialog, openConfirmDialog } =
    useBackendDialog();
  const { setLoading } = useLoading();
  const pagination = usePagination({
    list: bannerList,
    pageLimitSize: 10,
    initialPage: 1,
  });

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const { success, data } = await getAllBanners();
      setLoading(false);
      if (success) {
        setBannerList(data);
      }
    } catch (err) {
      setLoading(false);
      console.error('Error fetching banners:', err);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const openBannerDialog = async () => {
    const result = await openAddBannerDialog();
    if (result) {
      fetchBanners();
    }
  };

  const handleDelete = async (bannerId: number) => {
    const result = await openConfirmDialog(
      '系統提示',
      '確定要刪除此 Banner 嗎？'
    );
    if (result) {
      try {
        setLoading(true);
        const { success } = await deleteBanner(bannerId);
        setLoading(false);
        if (success) {
          await openInfoDialog('系統提示', 'Banner 已成功刪除！');
          fetchBanners();
        } else {
          await openInfoDialog('系統提示', '刪除失敗，請稍後再試！');
        }
      } catch (error) {
        setLoading(false);
        console.error('Error deleting banner:', error);
        await openInfoDialog('系統提示', '刪除失敗，請稍後再試！');
      }
    }
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
      <p className="bannerManagement__title">Banner 管理</p>

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
                { text: '圖片', className: '' },
                { text: '狀態', className: '' },
                { text: '發布日期', className: '' },
                { text: '操作', className: '' },
              ]}
            >
              {pagination.currentPageItems.map((banner, index) => (
                <BTableRow
                  key={index}
                  data={[
                    {
                      content: (
                        <>
                          {Array.isArray(banner?.imageUrls) &&
                            banner.imageUrls.length > 0 && (
                              <img
                                className="productDataManagement__image"
                                src={getImageUrl(banner.imageUrls[0])}
                                width={80}
                                height={80}
                              />
                            )}
                        </>
                      ),
                      dataTitle: '圖片',
                    },
                    {
                      content: <>{getStatusLabel(banner.status)}</>,
                      dataTitle: '預覽',
                    },
                    {
                      content: <>{<DateFormatter date={banner.createdAt} />}</>,
                      dataTitle: '發布日期',
                    },

                    {
                      content: (
                        <button
                          className="bannerManagement__btn"
                          onClick={() => handleDelete(banner.bannerId)}
                        >
                          刪除
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
        ) : (
          <Card>
            <NoData />
          </Card>
        )}
      </div>
    </div>
  );
};

export default BannerManagement;
