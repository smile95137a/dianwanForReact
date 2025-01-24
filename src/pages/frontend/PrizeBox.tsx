import React, { useEffect, useMemo, useState } from 'react';
import NumberFormatter from '@/components/common/NumberFormatter';
import { FaTrash } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { useLoading } from '@/context/frontend/LoadingContext';
import { getImageUrl } from '@/utils/ImageUtils';

import { getShippingMethod } from '@/services/frontend/shippingMethodService';
import { invoiceInfoOptions, paymentOptions } from '@/data/orderOptions';
import { FormProvider, useForm } from 'react-hook-form';
import CheckoutInfoForm from '@/components/frontend/CheckoutInfoForm';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import { useFrontendDialog } from '@/context/frontend/useFrontedDialog';
import { genRandom } from '@/utils/RandomUtils';
import { payPrizeCartItem } from '@/services/frontend/orderService';
import { getUserInfo } from '@/services/frontend/userService';
import {
  createAndSubmitForm,
  generateBaseFormData,
  generateCheckMacValue,
} from '@/utils/EcpayUtils';
import { removePrizeCartItem } from '@/services/frontend/prizeCartItemService';
import { getPrizeCart } from '@/services/frontend/prizeCartService';

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
      shopId: '',
      shopName: '',
      shopAddress: '',
    },
  });
  const invoice = methods.watch('invoice');
  const watchShippingMethod = methods.watch('shippingMethod');

  const validateForm = () => {
    try {
      const values = methods.getValues();
      // 驗證購買人資訊
      if (!values.billingName.trim()) {
        throw new Error('請填寫購買人姓名');
      }
      if (!values.billingEmail.trim()) {
        throw new Error('請填寫購買人電子郵件');
      }
      if (!/^\S+@\S+\.\S+$/.test(values.billingEmail)) {
        throw new Error('購買人電子郵件格式不正確');
      }
      if (!values.billingPhone.trim()) {
        throw new Error('請填寫購買人聯絡電話');
      }
      if (!/^\d{10}$/.test(values.billingPhone)) {
        throw new Error('購買人電話格式不正確，請輸入 10 位數字');
      }

      if (!values.billingCity.trim()) {
        throw new Error('請選擇購買人城市');
      }
      if (!values.billingArea.trim()) {
        throw new Error('請選擇購買人地區');
      }
      if (!values.billingAddress.trim()) {
        throw new Error('請填寫購買人地址');
      }

      // 驗證運送資訊
      if (!values.shippingName.trim()) {
        throw new Error('請填寫收件人姓名');
      }
      if (!values.shippingEmail.trim()) {
        throw new Error('請填寫收件人電子郵件');
      }
      if (!/^\S+@\S+\.\S+$/.test(values.shippingEmail)) {
        throw new Error('收件人電子郵件格式不正確');
      }
      if (!values.shippingPhone.trim()) {
        throw new Error('請填寫收件人聯絡電話');
      }
      if (!/^\d{10}$/.test(values.shippingPhone)) {
        throw new Error('收件人電話格式不正確，請輸入 10 位數字');
      }

      if (!values.shippingCity.trim()) {
        throw new Error('請選擇收件人城市');
      }
      if (!values.shippingArea.trim()) {
        throw new Error('請選擇收件人地區');
      }
      if (!values.shippingAddress.trim()) {
        throw new Error('請填寫收件人地址');
      }

      // 驗證發票資訊
      if (values.invoice === 'donation' && !values.donationCode.trim()) {
        throw new Error('請填寫愛心碼');
      }
      if (values.invoice === 'mobileCarrier' && !values.vehicle.trim()) {
        throw new Error('請填寫手機載具號碼');
      }

      // 驗證付款方式
      if (!values.paymentMethod) {
        throw new Error('請選擇付款方式');
      }

      // 驗證寄送方式
      if (!values.shippingMethod) {
        throw new Error('請選擇寄送方式');
      }
      if (
        ['sevenEleven', 'family'].includes(values.shippingMethod) &&
        !values.shopId
      ) {
        throw new Error('請選擇門市');
      }

      return true; // 通過驗證
    } catch (error) {
      if (error instanceof Error) {
        openInfoDialog('系統提示', error.message);
      } else {
        openInfoDialog('系統提示', '未知錯誤，請稍後再試！');
      }
      return false;
    }
  };

  const handleCheckout = async () => {
    if (!validateForm()) {
      return;
    }
    const values = methods.getValues();
    if (
      ['sevenEleven', 'family'].includes(values.shippingMethod) &&
      !values.shopId
    ) {
      await openInfoDialog('系統通知', `請選擇門市！`);
      return;
    }

    const payCart = {
      ...values,
      prizeCartItemIds: selectedItems.map((x) => x.prizeCartItemId),
    };

    try {
      setLoading(true);
      const { success, data } = await payPrizeCartItem(payCart);
      const { data: userInfo } = await getUserInfo();
      setLoading(false);

      if (success) {
        if (values.paymentMethod === '1') {
          const formData = generateBaseFormData(getShippingPrice);
          formData.MerchantTradeNo = data.orderNumber;
          formData.ChoosePayment = 'Credit';
          formData.ReturnURL =
            'http://13.208.176.189:8081/payment/paymentCallback2';
          formData.TradeDesc = `商城 - 信用卡結帳 ${data.orderNumber}`;
          formData.ItemName = selectedItems.map((x) => x.productName).join('#');
          const cmv = generateCheckMacValue(formData);

          createAndSubmitForm(
            'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5',
            { ...formData, CheckMacValue: cmv }
          );
        } else if (values.paymentMethod === '2') {
          const formData = generateBaseFormData(getShippingPrice);
          formData.MerchantTradeNo = data.orderNumber;
          formData.ChoosePayment = 'ATM';
          formData.ReturnURL =
            'http://13.208.176.189:8081/payment/paymentCallback2';
          formData.TradeDesc = `商城 - ATM ${data.orderNumber}`;
          formData.ItemName = selectedItems.map((x) => x.productName).join('#');
          const cmv = generateCheckMacValue(formData);
          createAndSubmitForm(
            'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5',
            { ...formData, CheckMacValue: cmv }
          );
        }
      } else {
        await openInfoDialog('系統消息', '支付失敗');
      }
    } catch (error) {
      console.error('支付異常:', error);
      await openInfoDialog('系統消息', '支付失敗');
    }
  };

  const loadCartItems = async () => {
    try {
      setLoading(true);
      const { success, data } = await getPrizeCart();
      setLoading(false);
      if (success) {
        if (!data || data.length === 0) {
          await openInfoDialog('系統消息', '賞品和無商品，跳轉至首頁');
          navigate('/main');
          return;
        }
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
    const initializeForm = async () => {
      // Load cart items
      loadCartItems();

      try {
        const { data: userInfo } = await getUserInfo();

        if (userInfo) {
          // Set individual field values
          if (userInfo.vehicle) methods.setValue('vehicle', userInfo.vehicle);
          if (userInfo.username)
            methods.setValue('billingEmail', userInfo.username);
          if (userInfo.addressName)
            methods.setValue('billingName', userInfo.addressName);
          if (userInfo.phoneNumber)
            methods.setValue('billingPhone', userInfo.phoneNumber);
          if (userInfo.address)
            methods.setValue('billingAddress', userInfo.address);
          if (userInfo.zipCode)
            methods.setValue('billingZipCode', userInfo.zipCode);
          if (userInfo.city) methods.setValue('billingCity', userInfo.city);
          setTimeout(() => {
            if (userInfo.area) methods.setValue('billingArea', userInfo.area);
          }, 100);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    initializeForm();
  }, [methods]);

  const handleCheckboxChange = (item: any) => {
    setSelectedItems((prevSelected) => {
      const isSelected = prevSelected.some(
        (selectedItem) => selectedItem.prizeCartItemId === item.prizeCartItemId
      );

      return isSelected
        ? prevSelected.filter(
            (selectedItem) =>
              selectedItem.prizeCartItemId !== item.prizeCartItemId
          )
        : [...prevSelected, item];
    });
  };

  const totalProductSize = useMemo(() => {
    return cartItems
      .filter((item) =>
        selectedItems.map((x) => x.prizeCartItemId).includes(item.id)
      )
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
  }, [totalProductSize]);

  const getShippingPrice = useMemo(() => {
    const selectedMethod = shippingMethods.find(
      (method) => method.code === watchShippingMethod
    );
    return selectedMethod ? selectedMethod.shippingPrice : 0;
  }, [shippingMethods, watchShippingMethod]);

  const { uuid } = useParams();

  const fetchData = async () => {};

  useEffect(() => {
    fetchData();
  }, [uuid]);

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
  const isAllSelected = useMemo(() => {
    return cartItems.length > 0 && selectedItems.length === cartItems.length;
  }, [cartItems, selectedItems]);

  const selectAllItems = () => {
    if (isAllSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems);
    }
  };

  const recycleItems = async () => {
    try {
      if (selectedItems.length === 0) {
        await openInfoDialog('系統消息', '請選擇要回收的商品');
        return;
      }

      setLoading(true);
      for (const item of selectedItems) {
        await removePrizeCartItem(item.prizeCartItemId);
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
            {isAllSelected ? '取消全選' : '全選'}
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
                  checked={selectedItems
                    .map((x) => x.prizeCartItemId)
                    .includes(item.prizeCartItemId)}
                  onChange={() => handleCheckboxChange(item)}
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
        <p className="prizeBox__text prizeBox__text--title m-y-24">寄送資訊</p>
        <div className="prizeBox__main">
          <div className="prizeBox__main-row">
            <div className="prizeBox__main-title">
              <p className="prizeBox__text">寄送</p>
            </div>
            <div className="prizeBox__main-content">
              {shippingMethods.map((option) => (
                <div key={genRandom(32)} className="prizeBox__content">
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
          {(watchShippingMethod === 'sevenEleven' ||
            watchShippingMethod === 'family') && (
            <>
              <p className="prizeBox__text prizeBox__text--title m-y-24">
                選擇門市
              </p>
              <button type="button" className="prizeBox__btn">
                請選擇門市
              </button>
              <div className="prizeBox__divider"></div>
            </>
          )}
          <CheckoutInfoForm />
        </div>
        <p className="prizeBox__text prizeBox__text--title  m-y-24">
          優惠及結帳
        </p>
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
                      <option key={genRandom(32)} value={option.value}>
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
                <div className="prizeBox__content" key={genRandom(32)}>
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
            <p className="prizeBox__text prizeBox__text--title">運費：</p>
            <p className="prizeBox__text prizeBox__text--money">
              $<NumberFormatter number={getShippingPrice} />
            </p>
          </div>

          <div className="prizeBox__total-item m-t-36">
            <p className="prizeBox__text prizeBox__text--title">總金額：</p>
            <p className="prizeBox__text prizeBox__text--totalMoney">
              $ <NumberFormatter number={getShippingPrice} />
            </p>
          </div>
        </div>
        <div className="prizeBox__btns">
          <div className="prizeBox__btn prizeBox__btn--back">回上頁</div>

          <button
            className="prizeBox__btn prizeBox__btn--checkout"
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
