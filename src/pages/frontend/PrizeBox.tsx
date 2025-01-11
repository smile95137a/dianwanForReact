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
import { getPrizeCart } from '@/services/frontend/prizeCartService';
import { removePrizeCartItem } from '@/services/frontend/prizeCartItemService';

const PrizeBox = () => {
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
      const { success, data } = await getPrizeCart();
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

  const deleteProduct = async (item: any) => {
    try {
      setLoading(true);
      const response = await removePrizeCartItem(item.prizeCartItemId);
      setLoading(false);
      if (response.success) {
        await loadCartItems();
      } else {
        await openInfoDialog('系統消息', `回收賞品失敗: ${response.message}`);
        console.error('回收賞品失敗:', response.message);
      }
    } catch (error: any) {
      setLoading(false);
      console.error('回收賞品時發生錯誤:', error);
      await openInfoDialog(
        '系統消息',
        `回收賞品失敗: ${error.message || '未知錯誤'}`
      );
    }
  };
  const selectAllItems = () => {
    const allItemIds = cartItems.map((item) => item.prizeCartItemId);
    setSelectedItems(allItemIds);
  };

  const recycleItems = async () => {
    try {
      if (selectedItems.length === 0) {
        await openInfoDialog('系統消息', '請選擇要回收的商品');
        return;
      }

      setLoading(true);
      for (const itemId of selectedItems) {
        const item = cartItems.find((item) => item.prizeCartItemId === itemId);
        if (item) {
          await removePrizeCartItem(item.prizeCartItemId);
        }
      }
      setLoading(false);
      await openInfoDialog('系統消息', '已成功回收選中商品');
      await loadCartItems();
      setSelectedItems([]);
    } catch (error: any) {
      setLoading(false);
      console.error('回收商品時發生錯誤:', error);
      await openInfoDialog(
        '系統消息',
        `回收商品失敗: ${error.message || '未知錯誤'}`
      );
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="prizeBox">
        <p className="prizeBox__text cart__text--title m-b-24">商品資訊</p>

        <div className="flex gap-x-24 m-b-12">
          <div className="prizeBox__btn--selectAll" onClick={selectAllItems}>
            全選
          </div>
          <div className="prizeBox__btn--selectAll" onClick={recycleItems}>
            回收
          </div>
        </div>

        <div className="prizeBox__products">
          {cartItems.map((item: any, index) => (
            <div key={index} className="prizeBox__product">
              <div className="prizeBox__product-item cart__product-item--selected">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.prizeCartItemId)}
                  onChange={() => handleCheckboxChange(item.prizeCartItemId)}
                />
              </div>
              <div className="prizeBox__product-item cart__product-item--img">
                {Array.isArray(item?.imageUrls) &&
                  item.imageUrls.length > 0 && (
                    <img src={getImageUrl(item.imageUrls[0])} alt="圖片" />
                  )}
              </div>
              <div className="prizeBox__product-item cart__product-item--name">
                <p className="prizeBox__text">{item.productName}</p>
              </div>
              <div className="prizeBox__product-item cart__product-item--quantity">
                <div className="flex flex-column text-right">
                  <p className="prizeBox__text prizeBox__text--blue">
                    可回收銀幣
                  </p>
                  <p className="prizeBox__text">
                    $<NumberFormatter number={~~item.sliverPrice} />
                  </p>
                </div>
              </div>
              <div className="prizeBox__product-item cart__product-item--delete">
                <div
                  className="flex items-center"
                  onClick={() => deleteProduct(item)}
                >
                  <FaTrash />
                  <p className="prizeBox__text">回收賞品</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="prizeBox__text cart__text--title m-y-24">寄送資訊</p>
        <div className="prizeBox__main">
          <div className="prizeBox__main-row">
            <div className="prizeBox__main-title">
              <p className="prizeBox__text">寄送</p>
            </div>
            <div className="prizeBox__main-content">
              {shippingMethods.map((option) => (
                <div key={option.name} className="prizeBox__content">
                  <div className="prizeBox__content-main">
                    <input
                      type="radio"
                      value={option.code}
                      id={option.name}
                      {...methods.register('shippingMethod')}
                    />
                    <p className="prizeBox__text">
                      {option.name} (${option.shippingPrice})
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="prizeBox__main-other">
              <p className="prizeBox__text">
                $ <NumberFormatter number={getShippingPrice} />
              </p>
            </div>
          </div>
          <div className="prizeBox__divider "></div>
          <CheckoutInfoForm />
        </div>
        <p className="prizeBox__text cart__text--title  m-y-24">優惠及結帳</p>
        <div className="prizeBox__main">
          <div className="prizeBox__main-row">
            <div className="prizeBox__main-title">
              <p className="prizeBox__text">發票</p>
            </div>
            <div className="prizeBox__main-content">
              <div className="prizeBox__content">
                <div className="prizeBox__content-main">
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
            <div className="prizeBox__main-row">
              <div className="prizeBox__main-title">
                <p className="prizeBox__text">愛心碼</p>
              </div>
              <div className="prizeBox__main-content">
                <div className="prizeBox__content">
                  <div className="prizeBox__content-main">
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
            <div className="prizeBox__main-row">
              <div className="prizeBox__main-title">
                <p className="prizeBox__text">手機載具號碼</p>
              </div>
              <div className="prizeBox__main-content">
                <div className="prizeBox__content">
                  <div className="prizeBox__content-main">
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
          <div className="prizeBox__divider "></div>
          <div className="prizeBox__main-row">
            <div className="prizeBox__main-title">
              <p className="prizeBox__text">付款</p>
            </div>
            <div className="prizeBox__main-content">
              {paymentOptions.map((option) => (
                <div className="prizeBox__content">
                  <div className="prizeBox__content-main">
                    <input
                      type="radio"
                      id={`payment-${option.value}`}
                      value={option.value}
                      {...methods.register('paymentMethod')}
                    />
                    <p className="prizeBox__text">{option.name}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="prizeBox__main-other"></div>
          </div>
        </div>

        <div className="prizeBox__total">
          <div className="prizeBox__total-item">
            <p className="prizeBox__text cart__text--title">運費：</p>
            <p className="prizeBox__text cart__text--money">
              $<NumberFormatter number={getShippingPrice} />
            </p>
          </div>

          <div className="prizeBox__total-item m-t-36">
            <p className="prizeBox__text cart__text--title">總金額：</p>
            <p className="prizeBox__text cart__text--totalMoney">
              $ <NumberFormatter number={getShippingPrice} />
            </p>
          </div>
        </div>
        <div className="prizeBox__btns">
          <div className="prizeBox__btn cart__btn--back">回上頁</div>

          <button
            className="prizeBox__btn cart__btn--checkout"
            onClick={handleCheckout}
          >
            結帳
          </button>
        </div>
      </div>
    </FormProvider>
  );
};

export default PrizeBox;
