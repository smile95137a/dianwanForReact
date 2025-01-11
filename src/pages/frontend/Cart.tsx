import React, { useCallback, useEffect, useMemo, useState } from 'react';
import logoImg from '@/assets/image/logo.png';
import NumberFormatter from '@/components/common/NumberFormatter';
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '@/context/frontend/LoadingContext';
import { getCart } from '@/services/frontend/cartService';
import { getImageUrl } from '@/utils/ImageUtils';
import {
  addCartItem,
  removeCartItem,
} from '@/services/frontend/cartItemService';
import { getShippingMethod } from '@/services/frontend/shippingMethodService';
import { invoiceInfoOptions, paymentOptions } from '@/data/orderOptions';
import { FormProvider, useForm } from 'react-hook-form';
import CheckoutInfoForm from '@/components/frontend/CheckoutInfoForm';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import { useFrontendDialog } from '@/context/frontend/useFrontedDialog';

const Cart = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [shippingMethods, setShippingMethods] = useState<any[]>([]);
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const { openInfoDialog } = useFrontendDialog();

  const isLogin = useSelector(
    (state: RootState) => state.frontend.auth.isLogin
  );

  useEffect(() => {
    if (!isLogin) {
      navigate('/main');
    }
  }, [isLogin, navigate]);

  const methods = useForm({
    defaultValues: {
      shippingName: '',
      shippingEmail: '',
      shippingPhone: '',
      shippingZipCode: '',
      shippingCity: '',
      shippingArea: '',
      shippingAddress: '',
      billingName: '',
      billingEmail: '',
      billingPhone: '',
      billingZipCode: '',
      billingCity: '',
      billingArea: '',
      billingAddress: '',
      shippingMethod: '',
      paymentMethod: '',
      invoice: '',
      vehicle: '',
      donationCode: '',
      sameAsBilling: false,
    },
  });
  const invoice = methods.watch('invoice');
  const watchShippingMethod = methods.watch('shippingMethod');

  const handleCheckout = () => {
    console.log(methods.getValues());
  };
  const loadCartItems = async () => {
    try {
      setLoading(true);
      const { success, data } = await getCart();
      setLoading(false);
      if (success) {
        setCartItems(data);
      } else {
        console.error('Failed to load cart items.');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error while loading cart items:', error);
    }
  };

  useEffect(() => {
    loadCartItems();
  }, []);

  const increaseQuantity = (item: any) => async () => {
    const cartItem = {
      productCode: item.productCode,
      quantity: 1,
    };
    try {
      setLoading(true);
      const response = await addCartItem(cartItem);
      setLoading(false);
      if (response.success) {
        await loadCartItems();
      } else {
        await openInfoDialog('系統消息', `添加購物車失敗: ${response.message}`);
        console.error('添加購物車失敗:', response.message);
      }
    } catch (error: any) {
      setLoading(false);
      console.error('添加購物車時發生錯誤:', error);
      await openInfoDialog(
        '系統消息',
        `添加購物車失敗: ${error.message || '未知錯誤'}`
      );
    }
  };

  const decreaseQuantity = (item: any) => async () => {
    try {
      setLoading(true);
      const response =
        item.quantity - 1 === 0
          ? await removeCartItem(item.cartItemId)
          : await addCartItem({
              productCode: item.productCode,
              quantity: -1,
            });
      setLoading(false);
      if (response.success) {
        await loadCartItems();
      } else {
        console.error(response.message);
      }
    } catch (error) {
      setLoading(false);
      console.error('操作購物車時發生錯誤:', error);
    }
  };
  const handleCheckboxChange = (itemId) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(itemId)
        ? prevSelected.filter((id) => id !== itemId)
        : [...prevSelected, itemId]
    );
  };

  const totalProductSize = useMemo(() => {
    return cartItems
      .filter((item) => selectedItems.includes(item.id))
      .reduce((sum, item) => sum + item.size, 0);
  }, [cartItems, selectedItems]);

  const fetchShippingMethod = async () => {
    try {
      const response = await getShippingMethod(totalProductSize);
      setShippingMethods(response.data);
    } catch (error) {
      console.error('Error fetching shipping methods:', error);
    }
  };
  useEffect(() => {
    fetchShippingMethod();
    // if (totalProductSize > 0) {
    // } else {
    //   setShippingMethods([]);
    // }
  }, [totalProductSize]);

  const getShippingPrice = useMemo(() => {
    const selectedMethod = shippingMethods.find(
      (method) => method.code === watchShippingMethod
    );
    return selectedMethod ? selectedMethod.shippingPrice : 0;
  }, [shippingMethods, watchShippingMethod]);

  return (
    <FormProvider {...methods}>
      <div className="cart">
        <p className="cart__text cart__text--title m-b-24">商品資訊</p>
        <div className="cart__products">
          {cartItems.map((item: any, index) => (
            <div key={index} className="cart__product">
              <div className="cart__product-item cart__product-item--selected">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.cartItemId)}
                  onChange={() => handleCheckboxChange(item.cartItemId)}
                />
              </div>
              <div className="cart__product-item cart__product-item--img">
                {Array.isArray(item?.imageUrls) &&
                  item.imageUrls.length > 0 && (
                    <img src={getImageUrl(item.imageUrls[0])} alt="圖片" />
                  )}
              </div>
              <div className="cart__product-item cart__product-item--name">
                <p className="cart__text">{item.productName}</p>
              </div>
              <div className="cart__product-item cart__product-item--quantity">
                <button
                  className="cart__product-quantityBtn cart__product-quantityBtn--decrease"
                  onClick={decreaseQuantity(item)}
                >
                  <FaMinus />
                </button>
                <span>{item.quantity}</span>
                <button
                  className="cart__product-quantityBtn cart__product-quantityBtn--increase"
                  onClick={increaseQuantity(item)}
                >
                  <FaPlus />
                </button>
              </div>
              <div className="cart__product-item cart__product-item--price">
                <p className="cart__text">
                  $<NumberFormatter number={item.totalPrice} />
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
              {shippingMethods.map((option) => (
                <div key={option.name} className="cart__content">
                  <div className="cart__content-main">
                    <input
                      type="radio"
                      value={option.code}
                      id={option.name}
                      {...methods.register('shippingMethod')}
                    />
                    <p className="cart__text">
                      {option.name} (${option.shippingPrice})
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart__main-other">
              <p className="cart__text">
                $ <NumberFormatter number={getShippingPrice} />
              </p>
            </div>
          </div>
          <div className="cart__divider "></div>
          <CheckoutInfoForm />
        </div>
        <p className="cart__text cart__text--title  m-y-24">優惠及結帳</p>
        <div className="cart__main">
          <div className="cart__main-row">
            <div className="cart__main-title">
              <p className="cart__text">發票</p>
            </div>
            <div className="cart__main-content">
              <div className="cart__content">
                <div className="cart__content-main">
                  <select
                    {...methods.register('invoice')}
                    className="checkoutInfoForm__select"
                  >
                    {invoiceInfoOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          {invoice === 'donation' && (
            <div className="cart__main-row">
              <div className="cart__main-title">
                <p className="cart__text">愛心碼</p>
              </div>
              <div className="cart__main-content">
                <div className="cart__content">
                  <div className="cart__content-main">
                    <input
                      type="text"
                      {...methods.register('donationCode')}
                      className="checkoutInfoForm__input"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          {invoice === 'mobileCarrier' && (
            <div className="cart__main-row">
              <div className="cart__main-title">
                <p className="cart__text">手機載具號碼</p>
              </div>
              <div className="cart__main-content">
                <div className="cart__content">
                  <div className="cart__content-main">
                    <input
                      type="text"
                      {...methods.register('vehicle')}
                      className="checkoutInfoForm__input"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="cart__divider "></div>
          <div className="cart__main-row">
            <div className="cart__main-title">
              <p className="cart__text">付款</p>
            </div>
            <div className="cart__main-content">
              {paymentOptions.map((option) => (
                <div className="cart__content">
                  <div className="cart__content-main">
                    <input
                      type="radio"
                      id={`payment-${option.value}`}
                      value={option.value}
                      {...methods.register('paymentMethod')}
                    />
                    <p className="cart__text">{option.name}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart__main-other"></div>
          </div>
        </div>

        <div className="cart__total">
          <div className="cart__total-item">
            <p className="cart__text cart__text--title">商品：</p>
            <p className="cart__text cart__text--money">
              <NumberFormatter
                number={cartItems.reduce(
                  (acc, item) => acc + item.totalPrice,
                  0
                )}
              />
            </p>
          </div>
          <div className="cart__total-item">
            <p className="cart__text cart__text--title">運費：</p>
            <p className="cart__text cart__text--money">
              $<NumberFormatter number={getShippingPrice} />
            </p>
          </div>

          <div className="cart__total-item m-t-36">
            <p className="cart__text cart__text--title">總金額：</p>
            <p className="cart__text cart__text--totalMoney">
              ${' '}
              <NumberFormatter
                number={
                  cartItems.reduce((acc, item) => acc + item.totalPrice, 0) +
                  getShippingPrice
                }
              />
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
    </FormProvider>
  );
};

export default Cart;
