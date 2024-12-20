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
  deleteNews,
  getAllNews,
  NewsStatus,
} from '@/services/backend/NewsService';
import React, { useEffect, useState } from 'react';

const NewsManagement = () => {
  const [newsList, setNewsList] = useState<News[]>([]);

  const { openAddNewsDialog, openConfirmDialog, openInfoDialog } =
    useBackendDialog();
  const { setLoading } = useLoading();

  const pagination = usePagination({
    list: newsList,
    pageLimitSize: 10,
    initialPage: 1,
  });
  const fetchNews = async () => {
    try {
      const { success, data } = await getAllNews();
      if (success) {
        setNewsList(data);
      }
    } catch (err) {
      console.error('Error fetching news:', err);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const openNewsDialog = async () => {
    const result = await openAddNewsDialog();
    if (result) {
      fetchNews();
    }
  };

  const handleEdit = (data: any) => async () => {
    const result = await openAddNewsDialog(true, data);
    if (result) {
      fetchNews();
    }
  };

  const handleDelete = async (id: number) => {
    const result = await openConfirmDialog('系統提示', '確定要刪除嗎？');

    if (result) {
      try {
        setLoading(true);
        const { success } = await deleteNews(id);
        setLoading(false);
        if (success) {
          await openInfoDialog('系統提示', '已成功刪除！');
          fetchNews();
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

  return (
    <div className="newsManagement">
      <p className="newsManagement__title">最新消息管理</p>
      <button className="newsManagement__btn m-b-12" onClick={openNewsDialog}>
        新增 News
      </button>
      <div className="newsManagement__list">
        {newsList.length > 0 ? (
          <div className="newsManagement__list-content">
            <BTable
              headers={[
                { text: '標題', className: '' },
                { text: '預覽', className: '' },
                { text: '發布日期', className: '' },
                { text: '狀態', className: '' },
                { text: '操作', className: '' },
              ]}
            >
              {pagination.currentPageItems.map((news, index) => (
                <BTableRow
                  key={index}
                  data={[
                    { content: <>{news.title}</>, dataTitle: '標題' },
                    {
                      content: <>{news.preview || '無預覽'}</>,
                      dataTitle: '預覽',
                    },
                    {
                      content: (
                        <>
                          <DateFormatter date={news.createdDate} />
                        </>
                      ),
                      dataTitle: '發布日期',
                    },
                    {
                      content: (
                        <>
                          {news.status === NewsStatus.AVAILABLE
                            ? '已發布'
                            : '未發布'}
                        </>
                      ),
                      dataTitle: '狀態',
                    },
                    {
                      content: (
                        <div className="newsManagement__btns">
                          <button
                            className="newsManagement__btn newsManagement__btn--edit"
                            onClick={handleEdit(news)}
                          >
                            編輯
                          </button>
                          <button
                            className="newsManagement__btn newsManagement__btn--del"
                            onClick={() => handleDelete(news.newsUid)}
                          >
                            刪除
                          </button>
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

export default NewsManagement;
