import logoImg from '@/assets/image/logo.png';

interface NoDataProps {
  text?: string;
}

const NoData: React.FC<NoDataProps> = ({
  text = '查無資料！您可嘗試其他搜尋條件！',
}) => {
  return (
    <div className="noData">
      <div className="noData__img">
        <img src={logoImg} alt="noData" />
      </div>
      <p className="noData__text">{text}</p>
    </div>
  );
};

export default NoData;
