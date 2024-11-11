import logoImg from '@/assets/image/logo.png';
const NoData = () => {
  return (
    <div className="fnoData">
      <div className="fnoData__img">
        <img src={logoImg} alt="fnoData" />
      </div>
      <p className="fnoData__text">查無資料！您可嘗試其他搜尋條件！</p>
    </div>
  );
};

export default NoData;
