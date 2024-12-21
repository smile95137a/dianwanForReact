import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '@/components/frontend/Breadcrumbs';
import DateFormatter from '@/components/common/DateFormatter';
import NoData from '@/components/frontend/NoData';
import { getAllNews } from '@/services/frontend/newsService';
import { getImageUrl } from '@/utils/ImageUtils';
import CircleIcon from '@/components/frontend/CircleIcon';
import { BsHandbag } from 'react-icons/bs';

const News: React.FC = () => {
  const [newsList, setNewsList] = useState<News[]>([]);
  const navigate = useNavigate();

  const breadcrumbItems = [{ name: '首頁', path: '/' }, { name: '最新消息' }];

  const fetchNewsList = async () => {
    try {
      const response = await getAllNews();
      if (response.success) {
        setNewsList(response.data);
      } else {
        console.error('Failed to fetch news list:', response.message);
      }
    } catch (error) {
      console.error('Error fetching news list:', error);
    }
  };

  const goToDetail = (newsUid: string) => {
    navigate(`/news/${newsUid}`);
  };

  useEffect(() => {
    fetchNewsList();
  }, []);

  return (
    <div className="news">
      <Breadcrumbs items={breadcrumbItems} />
      <div className="news__header">
        <div className="news__header-title">
          <div className="news__icon">
            <CircleIcon icon={BsHandbag} />
          </div>
          <p className="news__text">最新消息</p>
        </div>
      </div>

      {newsList.length === 0 ? (
        <NoData />
      ) : (
        <div className="news__list">
          {newsList.map((item) => (
            <div
              className="news__item"
              key={item.newsUid}
              onClick={() => goToDetail(item.newsUid)}
            >
              <div className="news__item-img">
                {Array.isArray(item.imageUrls) && item.imageUrls.length > 0 && (
                  <img src={getImageUrl(item.imageUrls[0])} alt="圖片預覽" />
                )}
              </div>
              <div className="news__item-content">
                <p className="news__text news__text--title">{item.title}</p>
                <p className="news__text">
                  <DateFormatter
                    date={item.createdDate}
                    format="YYYY/MM/DD HH:mm:ss"
                  />
                </p>
                <p
                  className="news__text news__text--preview"
                  dangerouslySetInnerHTML={{ __html: item.preview }}
                ></p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default News;
