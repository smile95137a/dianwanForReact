import Breadcrumbs from '@/components/frontend/Breadcrumbs';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from '@/assets/image/logo.png';
import NumberFormatter from '@/components/common/NumberFormatter';
const OrderSuccess = () => {
  const navigate = useNavigate();
  const [breadcrumbItems, setBreadcrumbItems] = useState([
    { name: '首頁' },
    { name: '商城' },
  ]);
  const goToHome = () => {
    navigate('/main');
  };
  const continueShopping = () => {
    navigate('/mallProduct');
  };

  return (
    <div>
      <div className="orderSuccess">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="orderSuccess__title m-t-72">
          <p className="orderSuccess__text orderSuccess__text--title">
            訂購成功
          </p>
          <p className="orderSuccess__text orderSuccess__text--subTitle">
            感謝您的消費！以下為您的訂單明細
          </p>
        </div>
        <div className="orderSuccess__main">
          <div className="orderSuccess__main-row">
            <div className="orderSuccess__main-title">
              <p className="orderSuccess__text">商品資訊</p>
            </div>
            <div className="orderSuccess__main-content">
              <div className="orderSuccess__content">
                <div className="orderSuccess__content-main">
                  <div className="orderSuccess__content-img">
                    <img src={logoImg} alt="" />
                  </div>
                  <p className="orderSuccess__text">
                    BANDAI 萬代Figure-rise Standard 七龍珠 巴達克 組裝模型
                  </p>
                </div>
                <div className="orderSuccess__content-other">$990</div>
              </div>
              <div className="orderSuccess__content">
                <div className="orderSuccess__content-main">
                  <div className="orderSuccess__content-img">
                    <img src={logoImg} alt="" />
                  </div>
                  <p className="orderSuccess__text">
                    BANDAI 萬代Figure-rise Standard 七龍珠 巴達克 組裝模型
                  </p>
                </div>
                <div className="orderSuccess__content-other">$990</div>
              </div>{' '}
              <div className="orderSuccess__content">
                <div className="orderSuccess__content-main">
                  <div className="orderSuccess__content-img">
                    <img src={logoImg} alt="" />
                  </div>
                  <p className="orderSuccess__text">
                    BANDAI 萬代Figure-rise Standard 七龍珠 巴達克 組裝模型
                  </p>
                </div>
                <div className="orderSuccess__content-other">$990</div>
              </div>
              <div className="orderSuccess__content">
                <div className="orderSuccess__content-main">
                  <div className="orderSuccess__content-img">
                    <img src={logoImg} alt="" />
                  </div>
                  <p className="orderSuccess__text">
                    BANDAI 萬代Figure-rise Standard 七龍珠 巴達克 組裝模型
                  </p>
                </div>
                <div className="orderSuccess__content-other">$990</div>
              </div>
            </div>
          </div>
          <div className="orderSuccess__main-row">
            <div className="orderSuccess__main-title">
              <p className="orderSuccess__text">寄送資訊</p>
            </div>
            <div className="orderSuccess__main-content">
              <div className="orderSuccess__content">
                <div className="orderSuccess__content-main">
                  <p className="orderSuccess__text">超商自取：7-11 中正門市</p>
                </div>
                <div className="orderSuccess__content-other">$60</div>
              </div>
              <div className="orderSuccess__content">
                <div className="orderSuccess__content-main">
                  <p className="orderSuccess__text">發票：個人二聯式發票</p>
                </div>
                <div className="orderSuccess__content-other"></div>
              </div>
            </div>
          </div>
          <div className="orderSuccess__main-row">
            <div className="orderSuccess__main-title">
              <p className="orderSuccess__text">優惠</p>
            </div>
            <div className="orderSuccess__main-content">
              <div className="orderSuccess__content">
                <div className="orderSuccess__content-main">
                  <p className="orderSuccess__text">滿$499折$50</p>
                </div>
                <div className="orderSuccess__content-other">-$50</div>
              </div>
            </div>
          </div>
          <div className="orderSuccess__main-row">
            <div className="orderSuccess__main-title">
              <p className="orderSuccess__text">付款</p>
            </div>
            <div className="orderSuccess__main-content">
              <div className="orderSuccess__content">
                <div className="orderSuccess__content-main">
                  <p className="orderSuccess__text">超商取貨付款</p>
                </div>
                <div className="orderSuccess__content-other"></div>
              </div>
            </div>
          </div>
          <div className="orderSuccess__main-total">
            <p className="orderSuccess__text orderSuccess__text--title">
              總金額：
            </p>
            <p className="orderSuccess__text orderSuccess__text--money">
              $ <NumberFormatter number={100000} />
            </p>
          </div>
        </div>
        <div className="orderSuccess__btns">
          <div
            className="orderSuccess__btn orderSuccess__btn--backHome"
            onClick={goToHome}
          >
            回首頁
          </div>
          <div
            className="orderSuccess__btn orderSuccess__btn--continue"
            onClick={continueShopping}
          >
            繼續購買
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
