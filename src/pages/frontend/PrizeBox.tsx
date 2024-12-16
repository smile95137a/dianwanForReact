import React, { useCallback, useEffect, useMemo, useState } from 'react';
import logoImg from '@/assets/image/logo.png';
import NumberFormatter from '@/components/common/NumberFormatter';
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '@/context/frontend/LoadingContext';
import { getCart } from '@/services/frontend/cartService';
import { getImageUrl } from '@/utils/ImageUtils';

import { getShippingMethod } from '@/services/frontend/shippingMethodService';
import { invoiceInfoOptions, paymentOptions } from '@/data/orderOptions';
import { FormProvider, useForm } from 'react-hook-form';
import CheckoutInfoForm from '@/components/frontend/CheckoutInfoForm';
import { getPrizeCart } from '@/services/frontend/prizeCartService';

const PrizeBox = () => {
  const [prizeBoxItems, setPrizeBoxItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [shippingMethods, setShippingMethods] = useState([]);

  const navigate = useNavigate();
  const { setLoading } = useLoading();

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
  const handleCheckout = () => {
    console.log(methods.getValues());
  };
  const loadPrizeBoxItems = async () => {
    try {
      setLoading(true);
      const { success, data } = await getPrizeCart();
      setLoading(false);
      if (success) {
        setPrizeBoxItems(data);
      } else {
        console.error('Failed to load cart items.');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error while loading cart items:', error);
    }
  };

  useEffect(() => {
    loadPrizeBoxItems();
  }, []);

  const handleCheckboxChange = (itemId) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(itemId)
        ? prevSelected.filter((id) => id !== itemId)
        : [...prevSelected, itemId]
    );
  };

  const totalProductAmount = prizeBoxItems
    .filter((item) => selectedItems.includes(item.cartItemId))
    .reduce((acc, item) => acc + item.totalPrice, 0);

  const totalProductSize = useMemo(() => {
    return prizeBoxItems
      .filter((item) => selectedItems.includes(item.id)) // Assuming `id` is the unique identifier
      .reduce((sum, item) => sum + item.size, 0);
  }, [prizeBoxItems, selectedItems]);

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

  const handleSelectAll = () => {
    // Mock: Replace with logic to select all items
    console.log('Select all items');
  };

  const handleRecycleItems = () => {
    // Mock: Replace with logic to recycle selected items
    console.log('Recycle selected items');
  };

  return (
    <FormProvider {...methods}>
      <div className="prizeBox">
        <p className="prizeBox__text prizeBox__text--title m-b-24">商品資訊</p>
        <div className="flex gap-x-24">
          <button
            className="mallCheckout__btn mallCheckout__btn--selectAll"
            onClick={handleSelectAll}
          >
            全選
          </button>
          <button
            className="mallCheckout__btn mallCheckout__btn--recycle"
            onClick={handleRecycleItems}
          >
            回收
          </button>
        </div>

        <div className="flex p-x-24 gap-x-12">
          <div className="w-5"></div>
          <div className="w-10"></div>
          <div className="w-20"></div>
          <div className="w-50"></div>
          <div className="w-20">
            <p className="font-size-20">可回收銀幣</p>
          </div>
          <div className="w-15"></div>
        </div>
        <div className="prizeBox__products">
          {prizeBoxItems.map((item, index) => (
            <div key={index} className="flex p-x-24 gap-x-12 prizeBox__product">
              <div className="w-5 prizeBox__product-item prizeBox__product-item--selected">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.prizeCartItemId)}
                  onChange={() => handleCheckboxChange(item.prizeCartItemId)}
                />
              </div>
              <div className="w-20 prizeBox__product-item prizeBox__product-item--img">
                <img src={getImageUrl(item.imageUrls[0])} alt="" />
              </div>
              <div className="w-50 prizeBox__product-item prizeBox__product-item--name">
                {item.productName}
              </div>
              <div className="w-20 prizeBox__product-item prizeBox__product-item--price">
                <p className="prizeBox__text">
                  $<NumberFormatter number={item.sliverPrice} />
                </p>
              </div>
              <div className="w-15 prizeBox__product-item prizeBox__product-item--delete">
                <FaTrash />
                <span>回收賞品</span>
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
                $ <NumberFormatter number={100000} />
              </p>
            </div>
          </div>
          <div className="prizeBox__divider "></div>
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
                  <select {...methods.register('invoice')}>
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
                    <input type="text" {...methods.register('donationCode')} />
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
                    <input type="text" {...methods.register('vehicle')} />
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
            <p className="prizeBox__text prizeBox__text--title">商品：</p>
            <p className="prizeBox__text prizeBox__text--money">
              <NumberFormatter number={totalProductAmount} />
            </p>
          </div>
          <div className="prizeBox__total-item">
            <p className="prizeBox__text prizeBox__text--title">運費：</p>
            <p className="prizeBox__text prizeBox__text--money">
              $<NumberFormatter number={100000} />
            </p>
          </div>

          <div className="prizeBox__total-item m-t-36">
            <p className="prizeBox__text prizeBox__text--title">總金額：</p>
            <p className="prizeBox__text prizeBox__text--totalMoney">
              $<NumberFormatter number={100000} />
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

export default PrizeBox;
