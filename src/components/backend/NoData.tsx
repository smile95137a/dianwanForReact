import noDataImg from '@/assets/image/nodata.svg';

const NoData = () => {
  return (
    <div className="noData">
      <div className="noData__img">
        <img src={noDataImg} alt="noData" />
      </div>
      <p className="noData__text">查無資料！您可嘗試其他搜尋條件！</p>
    </div>
  );
};

export default NoData;
