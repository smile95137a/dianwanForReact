import { executeDraw, getDrawStatus } from '@/services/frontend/drawService';
import { getProductDetailById } from '@/services/frontend/productDetailService';
import { getProductById } from '@/services/frontend/productService';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TitleBar from '../../components/frontend/TitleBar';
import { BsHandbag } from 'react-icons/bs';
import { getImageUrl } from '@/utils/ImageUtils';
import ticketImg from '@/assets/image/kujiblank.png';
import moment from 'moment';
import { FaCheck, FaChevronDown, FaThumbtack, FaTimes } from 'react-icons/fa';
import { MdChecklistRtl, MdOutlineOfflineBolt } from 'react-icons/md';
import { useFrontendDialog } from '@/context/frontend/useFrontedDialog';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useLoading } from '@/context/frontend/LoadingContext';
import { PrizeCategory } from '@/interfaces/product';
import { delay } from '@/utils/DelayUtils';
import ticketImages from '@/data/ticketImagesData';
import NumberFormatter from '@/components/common/NumberFormatter';
import productContactImg from '@/assets/image/product-contact.png';
import NoData from '@/components/frontend/NoData';
const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [productDetail, setProductDetail] = useState<any[]>([]);
  const [ticketList, setTicketList] = useState([]);
  const [activeTickets, setActiveTickets] = useState([]);
  const [showOption, setShowOption] = useState(false);
  const [endTimes, setEndTimes] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const {
    openInfoDialog,
    openDrawDialog,
    openTicketConfirmDialog,
    openDrawStepDialog,
    openImgDialog,
  } = useFrontendDialog();
  const { setLoading } = useLoading();

  const isLogin = useSelector(
    (state: RootState) => state.frontend.auth.isLogin
  );

  const remainingQuantity = useMemo(() => {
    return ticketList.filter((x: any) => !x.isDrawn).length;
  }, [ticketList]);

  let countdownInterval: any = null;
  const startCountdown = (endTime: any) => {
    const endMoment = moment(endTime);
    const now = moment();

    const duration = endMoment.diff(now, 'seconds');
    setCountdown(duration > 0 ? duration : 0);

    if (countdownInterval) {
      clearInterval(countdownInterval);
    }

    countdownInterval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown > 0) {
          return prevCountdown - 1;
        } else {
          clearInterval(countdownInterval);
          countdownInterval = null;
          return 0;
        }
      });
    }, 1000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productRes, productDetailRes, drawStatusRes] = await Promise.all(
          [getProductById(id), getProductDetailById(id), getDrawStatus(id)]
        );
        setLoading(false);
        if (productRes.success) {
          setProduct(productRes.data);
        }

        if (productDetailRes.success) {
          setProductDetail(productDetailRes.data);
        }

        if (drawStatusRes.success) {
          setTicketList(drawStatusRes.data.prizeNumberList);
        }
      } catch (error) {
        setLoading(false);
        console.error('失敗:', error);
        await openInfoDialog('系統消息', '系統問題，請稍後再嘗試。');
        navigate('/main');
      }
    };
    fetchData();
  }, [id]);

  const handleCheckboxChange = (ticket: any) => {
    setShowOption(true);
    setActiveTickets((prev: any) => {
      const isActive = prev.some(
        (t: any) => t.prizeNumberId === ticket.prizeNumberId
      );
      return isActive
        ? prev.filter((t: any) => t.prizeNumberId !== ticket.prizeNumberId)
        : [...prev, ticket];
    });
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

  const handleConfirm = (typeNum: any) => async () => {
    if (!isLogin) {
      await openInfoDialog('系統消息', '請先登入');
      return;
    }

    if (activeTickets.length === 0) {
      await openInfoDialog('系統消息', '請先選擇要抽的項目。');
      return;
    }

    const data = await openTicketConfirmDialog(typeNum, product, activeTickets);
    try {
      if (data) {
        const qu = remainingQuantity - activeTickets.length;
        setActiveTickets([]);
        await openDrawStepDialog({
          product: product,
          productDetail: productDetail,
          drawItemList: data,
        });
        await fetchDrawStatus();

        await openDrawDialog({ remainingQuantity: qu, data });
      }
    } catch (error: any) {
      const { message } = error.response.data;
      openInfoDialog('系統消息', message);
    }
  };

  const fetchDrawStatus = async () => {
    try {
      const { success, data } = await getDrawStatus(product.productId);

      if (success) {
        setTicketList(data.prizeNumberList);

        // if (product.productType === 'PRIZE') {
        //   const newEndTime = data.endTimes || null;
        //   if (newEndTime) {
        //     setEndTimes(newEndTime);
        //     startCountdown(newEndTime);
        //   }
        // }
      } else {
        openInfoDialog('系統消息', '系統錯誤');
      }
    } catch (error: any) {
      const { message } = error.response.data;
      openInfoDialog('系統消息', message);
    }
  };

  const handleImageClick = (imageUrl: string) => {
    openImgDialog(imageUrl);
  };

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
          <div className="productDetail__infoOther-item">
            <p className="productDetail__icon">
              <MdChecklistRtl />
            </p>
            <p className="productDetail__text">遊戲規則</p>
          </div>
          <div className="productDetail__infoOther-item">
            <p className="productDetail__icon">
              <FaThumbtack />
            </p>
            <p className="productDetail__text">關於本店</p>
          </div>
        </div>
      </div>
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
                <div className="productDetail__awardItem-grade">
                  <p className="productDetail__text">{detail.grade}賞</p>
                </div>
                <div className="productDetail__awardItem-name">
                  <p className="productDetail__text">{detail.productName}</p>
                </div>
                <div className="productDetail__awardItem-num">
                  <p className="productDetail__text">
                    {detail.quantity}/{detail.stockQuantity}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <NoData />
          )}
        </div>
        <div className="productDetail__awards-infos">
          <div className="productDetail__contact">
            <img src={productContactImg} />
          </div>
        </div>
      </div>
      <TitleBar icon={BsHandbag} titleText="籤桶" showMore={false} />

      <div className="productDetail__remainingQuantity">
        <div className="productDetail__text">
          剩餘數量：{~~remainingQuantity} / 總數量：{ticketList?.length || 0}
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
            <img
              src={getTicketImg(ticket)}
              className="productDetail__ticket-img"
            />
            <p className="productDetail__text">{ticket.number}</p>
          </label>
        ))}
      </div>
      {!expanded && (
        <div className="productDetail__more" onClick={toggleExpand}>
          <div className="productDetail__more-btn">
            <span>展開</span>
            <FaChevronDown />
          </div>
        </div>
      )}

      <div className="productDetail__action">
        {product?.prizeCategory !== PrizeCategory.BONUS ? (
          <>
            <div
              className="productDetail__action-btn productDetail__action-btn--confirm"
              onClick={handleConfirm(1)}
            >
              <FaCheck />
              金幣確認
            </div>
            <div
              className="productDetail__action-btn productDetail__action-btn--confirm"
              onClick={handleConfirm(2)}
            >
              <FaCheck />
              銀幣確認
            </div>
          </>
        ) : (
          <div
            className="productDetail__action-btn productDetail__action-btn--confirm"
            onClick={handleConfirm(3)}
          >
            <FaCheck />
            紅利確認
          </div>
        )}

        <div
          className="productDetail__action-btn productDetail__action-btn--all"
          onClick={handleSelectAll}
        >
          <FaCheck />
          全選
        </div>
        <div
          className="productDetail__action-btn productDetail__action-btn--rest"
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
