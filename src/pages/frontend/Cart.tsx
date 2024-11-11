import React from 'react';
import logoImg from '@/assets/image/logo.png';
import NumberFormatter from '@/components/common/NumberFormatter';
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/orderSuccess');
  };

  return (
    <div className="cart">
      <p className="cart__text cart__text--title m-b-24">商品資訊</p>
      <div className="cart__products">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="cart__product">
            <div className="cart__product-item cart__product-item--selected">
              <input type="checkbox" />
            </div>
            <div className="cart__product-item cart__product-item--img">
              <img src={logoImg} alt="" />
            </div>
            <div className="cart__product-item cart__product-item--name">
              <p className="cart__text">
                BANDAI 萬代Figure-rise Standard 七龍珠 巴達克 組裝模型
              </p>
            </div>
            <div className="cart__product-item cart__product-item--quantity">
              <button className="cart__product-quantityBtn cart__product-quantityBtn--decrease">
                <FaMinus />
              </button>
              <span>1</span>
              <button className="cart__product-quantityBtn cart__product-quantityBtn--increase">
                <FaPlus />
              </button>
            </div>
            <div className="cart__product-item cart__product-item--price">
              <p className="cart__text">
                $<NumberFormatter number={10000} />
              </p>
            </div>
            <div className="cart__product-item cart__product-item--delete">
              <FaTrash />
            </div>
          </div>
        ))}
      </div>
      <p className="cart__text cart__text--title m-y-24">寄送資訊</p>
      <div className="cart__main">
        <div className="cart__main-row">
          <div className="cart__main-title">
            <p className="cart__text">寄送</p>
          </div>
          <div className="cart__main-content">
            <div className="cart__content">
              <div className="cart__content-main">
                <input type="radio" name="" id="" />
                <p className="cart__text">宅配</p>
              </div>
            </div>{' '}
            <div className="cart__content">
              <div className="cart__content-main">
                <input type="radio" name="" id="" />
                <p className="cart__text">宅配</p>
              </div>
            </div>{' '}
            <div className="cart__content">
              <div className="cart__content-main">
                <input type="radio" name="" id="" />
                <p className="cart__text">宅配</p>
              </div>
            </div>{' '}
            <div className="cart__content">
              <div className="cart__content-main">
                <input type="radio" name="" id="" />
                <p className="cart__text">宅配</p>
              </div>
            </div>{' '}
            <div className="cart__content">
              <div className="cart__content-main">
                <input type="radio" name="" id="" />
                <p className="cart__text">宅配</p>
              </div>
            </div>{' '}
            <div className="cart__content">
              <div className="cart__content-main">
                <input type="radio" name="" id="" />
                <p className="cart__text">宅配</p>
              </div>
            </div>
          </div>
          <div className="cart__main-other">
            <p className="cart__text">
              $ <NumberFormatter number={100000} />
            </p>
          </div>
        </div>
        <div className="cart__divider "></div>
        <div className="cart__main-row">
          <div className="cart__main-title">
            <p className="cart__text">發票</p>
          </div>
          <div className="cart__main-content">
            <div className="cart__content">
              <div className="cart__content-main">
                <select name="" id=""></select>
              </div>
            </div>
          </div>
          <div className="cart__main-other"></div>
        </div>
      </div>
      <p className="cart__text cart__text--title  m-y-24">優惠及結帳</p>
      <div className="cart__main">
        <div className="cart__main-row">
          <div className="cart__main-title">
            <p className="cart__text">寄送</p>
          </div>
          <div className="cart__main-content">
            <div className="cart__content">
              <div className="cart__content-main">
                <input type="radio" name="" id="" />
                <p className="cart__text">優惠券</p>
              </div>
            </div>{' '}
            <div className="cart__content">
              <div className="cart__content-main">
                <input type="radio" name="" id="" />
                <p className="cart__text">優惠碼</p>
              </div>
            </div>
          </div>
          <div className="cart__main-other">
            <p className="cart__text">
              - $ <NumberFormatter number={100000} />
            </p>
          </div>
        </div>
        <div className="cart__divider "></div>
        <div className="cart__main-row">
          <div className="cart__main-title">
            <p className="cart__text">付款</p>
          </div>
          <div className="cart__main-content">
            <div className="cart__content">
              <div className="cart__content-main">
                <input type="radio" name="" id="" />
                <p className="cart__text">信用卡一次付清</p>
              </div>
            </div>{' '}
            <div className="cart__content">
              <div className="cart__content-main">
                <input type="radio" name="" id="" />
                <p className="cart__text">超商取貨付款</p>
              </div>
            </div>{' '}
          </div>
          <div className="cart__main-other"></div>
        </div>
      </div>

      <div className="cart__total">
        <div className="cart__total-item">
          <p className="cart__text cart__text--title">商品：</p>
          <p className="cart__text cart__text--money">
            <NumberFormatter number={100000} />
          </p>
        </div>
        <div className="cart__total-item">
          <p className="cart__text cart__text--title">運費：</p>
          <p className="cart__text cart__text--money">
            $<NumberFormatter number={100000} />
          </p>
        </div>
        <div className="cart__total-item">
          <p className="cart__text cart__text--title">折扣：</p>
          <p className="cart__text cart__text--money">
            -$
            <NumberFormatter number={100000} />
          </p>
        </div>
        <div className="cart__total-item m-t-36">
          <p className="cart__text cart__text--title">總金額：</p>
          <p className="cart__text cart__text--totalMoney">
            $<NumberFormatter number={100000} />
          </p>
        </div>
      </div>
      <div className="cart__btns">
        <div className="cart__btn cart__btn--back">回上頁</div>

        <button
          className="cart__btn cart__btn--checkout"
          onClick={handleCheckout}
        >
          結帳
        </button>
      </div>
    </div>
  );
};

export default Cart;
