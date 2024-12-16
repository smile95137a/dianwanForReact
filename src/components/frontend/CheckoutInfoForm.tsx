import React from 'react';
import { useFormContext } from 'react-hook-form';

const CheckoutInfoForm = () => {
  const { register } = useFormContext();
  return (
    <>
      <div className="cart__main-row">
        <div className="w-50 w-md-100">
          <p className="mallCheckout__text">購買人姓名</p>
          <input
            className="mallCheckout__form-input"
            {...register('billingName')}
          />
        </div>
        <div className="w-50 w-md-100">
          <p className="mallCheckout__text">購買人Email</p>
          <input
            className="mallCheckout__form-input"
            {...register('billingEmail')}
          />
        </div>
      </div>
      <div className="cart__main-row">
        <div className="w-100">
          <p className="mallCheckout__text">購買人電話</p>
          <input
            className="mallCheckout__form-input"
            {...register('billingPhone')}
          />
        </div>
      </div>
      <div className="cart__main-row flex-column">
        <p>購買人地址</p>
        <div className="flex">
          <div className="w-25 w-md-50">
            <input
              className="mallCheckout__form-input"
              {...register('billingCity')}
            />
          </div>
          <div className="w-25 w-md-50">
            <input
              className="mallCheckout__form-input"
              {...register('billingArea')}
            />
          </div>
          <div className="w-50 w-md-100">
            <input
              className="mallCheckout__form-input"
              {...register('billingAddress')}
            />
          </div>
        </div>
      </div>
      <div className="cart__main-row">
        <div className="w-50 w-md-100">
          <p className="mallCheckout__text">收貨人姓名</p>
          <input
            className="mallCheckout__form-input"
            {...register('shippingName')}
          />
        </div>
        <div className="w-50 w-md-100">
          <p className="mallCheckout__text">收貨人Email</p>
          <input
            className="mallCheckout__form-input"
            {...register('shippingEmail')}
          />
        </div>
      </div>
      <div className="cart__main-row">
        <div className="w-100">
          <p className="mallCheckout__text">收貨人電話</p>
          <input
            className="mallCheckout__form-input"
            {...register('shippingPhone')}
          />
        </div>
      </div>
      <div className="cart__main-row flex-column">
        <p>收貨人地址</p>
        <div className="flex">
          <div className="w-25 w-md-50">
            <input
              className="mallCheckout__form-input"
              {...register('shippingCity')}
            />
          </div>
          <div className="w-25 w-md-50">
            <input
              className="mallCheckout__form-input"
              {...register('shippingArea')}
            />
          </div>
          <div className="w-50 w-md-100">
            <input
              className="mallCheckout__form-input"
              {...register('shippingAddress')}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutInfoForm;
