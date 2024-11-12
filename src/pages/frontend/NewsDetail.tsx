import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '@/components/frontend/Breadcrumbs';
import DateFormatter from '@/components/common/DateFormatter';
import { getNewsById } from '@/services/frontend/newsService';

const NewsDetail: React.FC = () => {
  const { newsUid } = useParams<{ newsUid: string }>(); // Get newsUid from URL
  const [newsItem, setNewsItem] = useState<any | null>(null);

  // Breadcrumb items
  const [breadcrumbItems, setBreadcrumbItems] = useState([
    { name: '首頁', path: '/' },
    { name: '最新消息', path: '/news' },
  ]);

  // Fetch news detail
  const fetchNewsDetail = async (uid: string) => {
    try {
      const { success, data, message } = await getNewsById(uid);
      if (success) {
        setNewsItem(data);
        setBreadcrumbItems((prevItems) => [...prevItems, { name: data.title }]);
      } else {
        console.error('Error fetching news:', message);
      }
    } catch (error) {
      console.error('Error fetching news detail:', error);
    }
  };

  useEffect(() => {
    if (newsUid) {
      fetchNewsDetail(newsUid);
    }
  }, [newsUid]);

  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />
      {newsItem ? (
        <div className="newsDetail">
          <div className="newsDetail__title">
            <div className="newsDetail__title-title">
              <p className="newsDetail__text">{newsItem.title}</p>
            </div>
          </div>
          <p className="newsDetail__text">
            <DateFormatter
              date={newsItem.createdDate}
              format="YYYY/MM/DD HH:mm:ss"
            />
          </p>
          <hr className="m-t-24" />
          <div className="newsDetail__content"></div>
          <div
            className="newsDetail__preview"
            dangerouslySetInnerHTML={{ __html: newsItem.preview }}
          ></div>
          <div
            className="newsDetail__fullContent"
            dangerouslySetInnerHTML={{ __html: newsItem.content }}
          ></div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default NewsDetail;
