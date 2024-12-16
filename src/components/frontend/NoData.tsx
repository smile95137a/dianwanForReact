import logoImg from '@/assets/image/logo.png';
const NoData = () => {
  return (
    <div className="noData">
      <div className="noData__img">
        <img src={logoImg} alt="noData" />
      </div>
      <p className="noData__text">查無資料！您可嘗試其他搜尋條件！</p>
    </div>
  );
};

export default NoData;
