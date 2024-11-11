import BTable from '@/components/backend/btable/BTable';
import BTableRow from '@/components/backend/btable/BTableRow';
import NoData from '@/components/backend/NoData';
import Pagination from '@/components/backend/Pagination';
import DateFormatter from '@/components/common/DateFormatter';
import Card from '@/components/frontend/MCard';
import { usePagination } from '@/hooks/usePagination';
import { getAllNews, NewsStatus } from '@/services/backend/NewsService';
import React, { useEffect, useState } from 'react';

const NewsManagement = () => {
  const [newsList, setNewsList] = useState<News[]>([]);

  const pagination = usePagination({
    list: newsList,
    pageLimitSize: 10,
    initialPage: 1,
    showPaginationPageNum: 5,
  });

  useEffect(() => {
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

    fetchNews();
  }, []);

  return (
    <div className="newsManagement">
      <p className="newsManagement__title">最新消息管理</p>

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
                          <DateFormatter date={news.publishDate} />
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
                        <button className="newsManagement__btn">編輯</button>
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

export default NewsManagement;
