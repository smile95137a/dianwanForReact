import { executeDraw, getDrawStatus } from '@/services/frontend/drawService';
import { getProductDetailById } from '@/services/frontend/productDetailService';
import { getProductById } from '@/services/frontend/productService';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TitleBar from '../../components/frontend/TitleBar';
import { BsHandbag } from 'react-icons/bs';
import { getImageUrl } from '@/utils/ImageUtils';
import ticketImg from '@/assets/image/kujiblank.png';
import iconG from '@/assets/image/di-icon-g.png';
import iconS from '@/assets/image/di-icon-s.png';
import iconB from '@/assets/image/di-icon-b.png';
import {
  FaCheck,
  FaChevronDown,
  FaChevronUp,
  FaRegCheckCircle,
  FaThumbtack,
  FaTimes,
} from 'react-icons/fa';
import { MdChecklistRtl, MdOutlineOfflineBolt } from 'react-icons/md';
import { useFrontendDialog } from '@/context/frontend/useFrontedDialog';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useLoading } from '@/context/frontend/LoadingContext';
import { PrizeCategory } from '@/interfaces/product';
import ticketImages from '@/data/ticketImagesData';
import NumberFormatter from '@/components/common/NumberFormatter';
import productContactImg from '@/assets/image/di-p-info.png';
import NoData from '@/components/frontend/NoData';
import ProductCountdown from '@/components/frontend/ProductCountdown';
import SocialLinks from '@/components/common/SocialLinks';
import moment from 'moment';
import useForceUpdate from '@/hooks/useForceUpdate';
const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [productDetail, setProductDetail] = useState<any[]>([]);
  const [ticketList, setTicketList] = useState([]);
  const [activeTickets, setActiveTickets] = useState([]);
  const [showOption, setShowOption] = useState(false);
  const [endTimes, setEndTimes] = useState(null);
  const [isCustmerPrize, setIsCustmerPrize] = useState(false);
  const [showBouns, setShowBouns] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const {
    openInfoDialog,
    openDrawDialog,
    openTicketConfirmDialog,
    openDrawStepDialog,
    openImgDialog,
  } = useFrontendDialog();
  const { setLoading } = useLoading();
  const forceUpdate = useForceUpdate();
  const isLogin = useSelector(
    (state: RootState) => state.frontend.auth.isLogin
  );

  const remainingQuantity = useMemo(() => {
    return ticketList.filter((x: any) => !x.isDrawn).length;
  }, [ticketList]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productRes, productDetailRes, drawStatusRes] = await Promise.all([
        getProductById(id),
        getProductDetailById(id),
        getDrawStatus(id),
      ]);
      setLoading(false);
      if (productRes.success) {
        setProduct(productRes.data);
        const isCustomer = productRes.data.productType === 'CUSTMER_PRIZE';
        const isBonus = productRes.data.prizeCategory === 'BONUS';
        if (productRes.data.status !== 'AVAILABLE') {
          navigate('/main');
        }
        setIsCustmerPrize(isCustomer);
        setShowBouns(isBonus);
      }

      if (productDetailRes.success) {
        setProductDetail(productDetailRes.data);
      }

      if (drawStatusRes.success) {
        setTicketList(drawStatusRes.data.prizeNumberList);
        if (productRes.data.productType === 'PRIZE') {
          const endTime = drawStatusRes.data.endTimes || null;
          if (endTime) setEndTimes(endTime);
        }
      }
    } catch (error) {
      setLoading(false);
      console.error('失敗:', error);
      await openInfoDialog('系統消息', '系統問題，請稍後再嘗試。');
      navigate('/main');
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleCheckboxChange = (ticket: any) => {
    setShowOption(true);

    const isActive = activeTickets.some(
      (x) => x.prizeNumberId === ticket.prizeNumberId
    );
    if (isActive) {
      setActiveTickets((prev) =>
        prev.filter((x) => x.prizeNumberId !== ticket.prizeNumberId)
      );
    } else if (isCustmerPrize) {
      if (activeTickets.length >= 1) {
        alert('最多一個。');
      } else {
        setActiveTickets((prev) => [...prev, ticket]);
      }
    } else {
      setActiveTickets((prev) => [...prev, ticket]);
    }
  };

  const getTicketImg = (ticket: any) => {
    const { productType } = product;
    const { level, isDrawn } = ticket;

    return isDrawn ? ticketImages[level] || ticketImages.BLANK : ticketImg;
  };
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => setExpanded(!expanded);

  const handleSelectAll = () => {
    const selectableTickets = ticketList.filter(
      (ticket: any) => !ticket.isDrawn
    );
    setActiveTickets(selectableTickets);
    setShowOption(true);
  };

  const handleReset = () => {
    setActiveTickets([]);
    setShowOption(false);
  };

  const handleExchange = (typeNum: any) => async () => {
    if (!isLogin) {
      await openInfoDialog('系統消息', '請先登入');
      return;
    }

    if (activeTickets.length === 0) {
      await openInfoDialog('系統消息', '請先選擇要抽的項目。');
      return;
    }

    if (isCustmerPrize) {
      if (!inputCode.trim()) {
        await openInfoDialog('系統通知', '請輸入代碼');
        return;
      }
    }

    const data = await openTicketConfirmDialog(
      isCustmerPrize,
      inputCode,
      typeNum,
      product,
      activeTickets
    );
    try {
      if (data) {
        const qu = remainingQuantity - activeTickets.length;
        setActiveTickets([]);
        const { data: drawStatus } = await getDrawStatus(id);

        await openDrawStepDialog({
          product: product,
          productDetail: productDetail,
          drawItemList: data,
          endTimes: drawStatus.endTimes,
        });
        await fetchData();
        await openDrawDialog({ remainingQuantity: qu, data, product: product });
      }
    } catch (error: any) {
      const { message } = error.response.data;
      openInfoDialog('系統消息', message);
    }
  };

  const handleImageClick = (imageUrl: string) => {
    openImgDialog(imageUrl);
  };
  const handleGameRulesClick = async () => {
    await openInfoDialog('遊戲規則', product.description);
  };

  const handleAboutClick = async () => {
    await openInfoDialog(
      '遊戲規則',
      `<p>快來加入我們，感受「電玩賞」帶來的全新抽獎體驗！</p>
        <p>《電玩賞》專為喜愛數位娛樂的您打造，讓您在家中就能輕鬆參與抽獎，感受心跳加速的刺激時刻！我們的獎品涵蓋熱門手游帳號、稀有遊戲資源，以及廣受歡迎的3C電子產品，總有一項會成為您心中的夢幻之選。</p>
        <p>只需輕鬆線上儲值，就能解鎖超值優惠，享受更高的中獎機率和專屬折扣。無需前往實體店鋪，讓我們直接將您的專屬驚喜送到您家門口！</p>
        <p>不管是尋找夢幻稀有帳號，還是追求極致科技好物，「電玩賞」都能滿足您的願望！更有多重活動與限定特典，讓您在參與的同時享受更多驚喜！</p>
        <p>趕快加入「電玩賞」的行列，測試您的運氣，成為下一位大獎得主！</p>`
    );
  };

  useEffect(() => {
    const calculateCountdown = () => {
      forceUpdate();
    };

    calculateCountdown();

    const intervalId = setInterval(() => {
      calculateCountdown();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [endTimes]);

  return (
    <div className="productDetail">
      <div className="productDetail__infos">
        <div className="productDetail__infoHeader">
          <div className="productDetail__infoHeader-item productDetail__infoHeader-item--status">
            <div className="productDetail__status">
              <div className="productDetail__icon">
                <MdOutlineOfflineBolt />
              </div>
              <p className="productDetail__text">開抽中</p>
              <p className="productDetail__text">
                <span>NT</span>
                <span className="productDetail__text productDetail__text--money">
                  <NumberFormatter number={~~product?.price} />
                </span>
              </p>
            </div>
          </div>
          <div className="productDetail__infoHeader-item">
            <p className="productDetail__text productDetail__text--productName">
              {product?.productName}
            </p>
          </div>
        </div>
        <div className="productDetail__infoImgs">
          {Array.isArray(product?.imageUrls) &&
            product.imageUrls.length > 0 && (
              <img src={getImageUrl(product.imageUrls[0])} alt="產品圖片" />
            )}
        </div>
        <div className="productDetail__infoOther">
          <div
            className="productDetail__infoOther-item"
            onClick={handleGameRulesClick}
          >
            <p className="productDetail__icon">
              <MdChecklistRtl />
            </p>
            <p className="productDetail__text">遊戲規則</p>
          </div>
          <div
            className="productDetail__infoOther-item"
            onClick={handleAboutClick}
          >
            <p className="productDetail__icon">
              <FaThumbtack />
            </p>
            <p className="productDetail__text">關於本店</p>
          </div>
        </div>

        <div className="productDetail__endTime">
          {endTimes && <ProductCountdown endTime={endTimes} />}
        </div>
      </div>
      {isCustmerPrize && (
        <div className="productDetail__inputCode m-y-12">
          <label htmlFor="inputCode" className="productDetail__inputCode-text">
            請輸入代碼：
          </label>
          <input
            id="inputCode"
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="productDetail__inputCode-input"
            placeholder="輸入您的代碼"
          />
        </div>
      )}
      <TitleBar icon={BsHandbag} titleText="獎項" showMore={false} />
      <div className="productDetail__awards">
        <div className="productDetail__awards-list">
          {productDetail.length > 0 ? (
            productDetail.map((detail: any, index) => (
              <div key={index} className="productDetail__awardItem">
                <div className="productDetail__awardItem-img">
                  {Array.isArray(detail?.imageUrls) &&
                    detail.imageUrls.length > 0 && (
                      <img
                        src={getImageUrl(detail.imageUrls[0])}
                        alt="產品圖片"
                        onClick={() => handleImageClick(detail.imageUrls[0])}
                      />
                    )}
                </div>
                <div className="productDetail__awardItem-box">
                  <div className="productDetail__awardItem-grade">
                    <p className="productDetail__text">{detail.grade}賞</p>
                  </div>
                  <div className="productDetail__awardItem-infos">
                    <div className="productDetail__awardItem-name">
                      <p className="productDetail__text">
                        {detail.productName}
                      </p>
                    </div>
                    <div className="productDetail__awardItem-num">
                      <p className="productDetail__text">
                        {detail.quantity}/{detail.stockQuantity}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <NoData />
          )}
        </div>
        <div className="productDetail__awards-infos">
          <div className="productDetail__contact">
            <div className="productDetail__contact-img">
              <img src={productContactImg} />
            </div>

            <div className="productDetail__contact-title">客服資訊</div>
            <div className="productDetail__contact-content">
              平台操作或抽獎問題
              <br />
              聯繫官方資訊
            </div>
            <div className="productDetail__contact-social">
              <SocialLinks />
            </div>
          </div>
        </div>
      </div>
      <TitleBar icon={BsHandbag} titleText="籤桶" showMore={false} />
      <div className="productDetail__remainingQuantity">
        <div className="productDetail__text">
          剩餘數量：
          <NumberFormatter number={~~remainingQuantity} /> / 總數量：
          <NumberFormatter number={~~ticketList?.length || 0} />
        </div>
      </div>
      <div
        className="productDetail__sign"
        style={{
          height: expanded ? 'auto' : '500px',
          overflow: expanded ? 'visible' : 'hidden',
        }}
      >
        {ticketList.map((ticket: any, index) => (
          <label
            key={index}
            className={`productDetail__ticket ${
              activeTickets.some(
                (t: any) => t.prizeNumberId === ticket.prizeNumberId
              )
                ? 'productDetail__ticket--active'
                : ''
            }`}
          >
            <input
              type="checkbox"
              className="productDetail__ticket-check"
              checked={activeTickets.some(
                (t: any) => t.prizeNumberId === ticket.prizeNumberId
              )}
              onChange={() => handleCheckboxChange(ticket)}
              disabled={ticket.isDrawn}
            />
            <div className="productDetail__ticket-img">
              <div className="productDetail__ticket-img-active">
                <FaRegCheckCircle />
              </div>
              <img src={getTicketImg(ticket)} />
            </div>
            <p className="productDetail__text">{ticket.number}</p>
          </label>
        ))}
      </div>
      <div className="flex justify-center">
        {endTimes && <ProductCountdown endTime={endTimes} />}
      </div>
      {!expanded && (
        <div className="productDetail__more" onClick={toggleExpand}>
          <div className="productDetail__more-btn">
            <span>展開</span>
            <FaChevronDown />
          </div>
        </div>
      )}
      {expanded && (
        <div className="productDetail__more" onClick={toggleExpand}>
          <div className="productDetail__more-btn">
            <span>收合</span>
            <FaChevronUp />
          </div>
        </div>
      )}
      <div className="productDetail__action">
        <>
          <div
            className={`productDetail__action-btn productDetail__action-btn--red productDetail__action-btn--buy ${
              endTimes ? 'productDetail__action-btn--b-w' : ''
            }`}
          >
            <FaCheck />

            {endTimes ? (
              <ProductCountdown countdownText="需等" endTime={endTimes} />
            ) : (
              <>可購買</>
            )}
          </div>
        </>

        {isCustmerPrize ? (
          <div
            className="productDetail__action-btn productDetail__action-btn--red productDetail__action-btn--code"
            onClick={handleExchange(4)}
          >
            <FaCheck />
            代碼兌換
          </div>
        ) : product?.prizeCategory !== PrizeCategory.BONUS ? (
          <>
            <div
              className="productDetail__action-btn productDetail__action-btn--red productDetail__action-btn--g"
              onClick={handleExchange(1)}
            >
              <img src={iconG} alt="Gold Icon" />
              代幣確認
            </div>
            <div
              className="productDetail__action-btn productDetail__action-btn--red productDetail__action-btn--s"
              onClick={handleExchange(2)}
            >
              <img src={iconS} alt="Gold Icon" />
              點數確認
            </div>
          </>
        ) : (
          <div
            className="productDetail__action-btn productDetail__action-btn--red productDetail__action-btn--b"
            onClick={handleExchange(3)}
          >
            <img src={iconB} alt="Bouns Icon" />
            紅利確認
          </div>
        )}

        <div
          className={`productDetail__action-btn productDetail__action-btn--all `}
          onClick={handleSelectAll}
        >
          <FaCheck />
          全選
        </div>
        <div
          className={`productDetail__action-btn productDetail__action-btn--rest `}
          onClick={handleReset}
        >
          <FaTimes />
          重選
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
