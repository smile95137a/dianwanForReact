import React, { useEffect, useMemo, useState } from 'react';
import NumberFormatter from '@/components/common/NumberFormatter';
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
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
import { genRandom } from '@/utils/RandomUtils';
import { payCartItem } from '@/services/frontend/orderService';
import { getUserInfo } from '@/services/frontend/userService';
import {
  createAndSubmitForm,
  generateBaseFormData,
  generateCheckMacValue,
} from '@/utils/EcpayUtils';

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
    // 驗證表單
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
      cartItemIds: selectedItems.map((x) => x.cartItemId),
    };

    try {
      setLoading(true);
      const { success, data } = await payCartItem(payCart);
      const { data: userInfo } = await getUserInfo();
      setLoading(false);

      if (success) {
        if (values.paymentMethod === '1') {
          const formData = generateBaseFormData(
            totalProductPrice + getShippingPrice
          );
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
          const formData = generateBaseFormData(
            totalProductPrice + getShippingPrice
          );
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
      const { success, data } = await getCart();
      setLoading(false);
      if (success) {
        if (!data || data.length === 0) {
          await openInfoDialog('系統消息', '購物車無商品，跳轉至首頁');
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
      .filter((item) =>
        selectedItems.map((x) => x.cartItemId).includes(item.id)
      )
      .reduce((sum, item) => sum + item.size, 0);
  }, [cartItems, selectedItems]);

  const totalProductPrice = useMemo(() => {
    return cartItems
      .filter((item) =>
        selectedItems.map((x) => x.cartItemId).includes(item.cartItemId)
      )
      .reduce((sum, item) => sum + item.totalPrice, 0);
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

  const handleSelectStore = async () => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://logistics-stage.ecpay.com.tw/Express/map'; // 綠界物流地圖測試環境 URL

    const params = {
      MerchantID: '3002607',
      MerchantTradeNo: `TRADE${Date.now()}`,
      LogisticsType: 'CVS',
      LogisticsSubType: 'UNIMART',
      IsCollection: 'N',
      ServerReplyURL: 'http://13.208.176.189:8081/api/logistics/callback',
      ExtraData: genRandom(16),
      Device: '0',
    };

    Object.entries(params).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value.toString();
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  const { uuid } = useParams();

  const fetchData = async () => {};

  useEffect(() => {
    fetchData();
  }, [uuid]);

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
                  checked={selectedItems
                    .map((x) => x.cartItemId)
                    .includes(item.cartItemId)}
                  onChange={() => handleCheckboxChange(item)}
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
              {shippingMethods.map((option, index) => (
                <div key={index} className="cart__content">
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
          {(watchShippingMethod === 'sevenEleven' ||
            watchShippingMethod === 'family') && (
            <>
              <p className="cart__text cart__text--title m-y-24">選擇門市</p>
              <button type="button" className="cart__btn">
                請選擇門市
              </button>
              <div className="cart__divider"></div>
            </>
          )}
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
                      <option key={option.label} value={option.value}>
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
              {paymentOptions.map((option, index) => (
                <div className="cart__content" key={index}>
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
              <NumberFormatter number={totalProductPrice} />
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
              <NumberFormatter number={totalProductPrice + getShippingPrice} />
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
