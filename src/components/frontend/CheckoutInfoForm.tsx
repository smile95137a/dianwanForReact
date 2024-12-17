import {
  getAllCityNames,
  getAreaListByCityName,
} from '@/services/frontend/taiwanCitiesService';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

const CheckoutInfoForm = () => {
  const { register, watch, setValue } = useFormContext();

  // Billing States
  const [billCityOptions, setBillCityOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [billAreaOptions, setBillAreaOptions] = useState<
    { value: string; label: string }[]
  >([]);

  // Shipping States
  const [shipCityOptions, setShipCityOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [shipAreaOptions, setShipAreaOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const watchBillingCity = watch('billingCity');
  const watchShippingCity = watch('shippingCity');
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const cityNames = getAllCityNames();
        setBillCityOptions([
          { value: '', label: '縣市' },
          ...cityNames.map((city) => ({ value: city, label: city })),
        ]);
        setBillAreaOptions([{ value: '', label: '行政區' }]);
        setShipCityOptions([
          { value: '', label: '縣市' },
          ...cityNames.map((city) => ({ value: city, label: city })),
        ]);
        setShipAreaOptions([{ value: '', label: '行政區' }]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchInitialData();
  }, [setValue]);

  useEffect(() => {
    if (watchBillingCity) {
      setValue('billingArea', '');
      const areas = getAreaListByCityName(watchBillingCity);
      setBillAreaOptions([
        { value: '', label: '行政區' },
        ...areas.map((area) => ({
          value: area.areaName,
          label: area.areaName,
        })),
      ]);
    } else {
      setBillAreaOptions([{ value: '', label: '行政區' }]);
    }
  }, [watchBillingCity, setValue]);

  useEffect(() => {
    if (watchShippingCity) {
      setValue('shippingArea', '');
      const areas = getAreaListByCityName(watchShippingCity);
      setShipAreaOptions([
        { value: '', label: '行政區' },
        ...areas.map((area) => ({
          value: area.areaName,
          label: area.areaName,
        })),
      ]);
    } else {
      setShipAreaOptions([{ value: '', label: '行政區' }]);
    }
  }, [watchShippingCity, setValue]);

  return (
    <>
      <div className="flex gap-x-12">
        <div className="w-50 w-md-100">
          <p className="checkoutInfoForm__text">購買人姓名</p>
          <input
            className="checkoutInfoForm__input"
            {...register('billingName')}
          />
        </div>
        <div className="w-50 w-md-100">
          <p className="checkoutInfoForm__text">購買人Email</p>
          <input
            className="checkoutInfoForm__input"
            {...register('billingEmail')}
          />
        </div>
      </div>
      <div className="flex">
        <div className="w-100">
          <p className="checkoutInfoForm__text">購買人電話</p>
          <input
            className="checkoutInfoForm__input"
            {...register('billingPhone')}
          />
        </div>
      </div>
      <div className="flex flex-column">
        <p>購買人地址</p>
        <div className="flex  gap-x-12">
          <div className="w-25 w-md-50">
            <select
              {...register('billingCity')}
              className="checkoutInfoForm__select"
            >
              {billCityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="w-25 w-md-50">
            <select
              {...register('billingArea')}
              className="checkoutInfoForm__select"
            >
              {billAreaOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="w-50 w-md-100">
            <input
              className="checkoutInfoForm__input"
              {...register('billingAddress')}
            />
          </div>
        </div>
      </div>
      <div className="flex  gap-x-12">
        <div className="w-50 w-md-100">
          <p className="checkoutInfoForm__text">收貨人姓名</p>
          <input
            className="checkoutInfoForm__input"
            {...register('shippingName')}
          />
        </div>
        <div className="w-50 w-md-100">
          <p className="checkoutInfoForm__text">收貨人Email</p>
          <input
            className="checkoutInfoForm__input"
            {...register('shippingEmail')}
          />
        </div>
      </div>
      <div className="flex">
        <div className="w-100">
          <p className="checkoutInfoForm__text">收貨人電話</p>
          <input
            className="checkoutInfoForm__input"
            {...register('shippingPhone')}
          />
        </div>
      </div>
      <div className="flex flex-column">
        <p>收貨人地址</p>
        <div className="flex  gap-x-12">
          <div className="w-25 w-md-50">
            <select
              {...register('shippingCity')}
              className="checkoutInfoForm__select"
            >
              {shipCityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="w-25 w-md-50">
            <select
              {...register('shippingCity')}
              className="checkoutInfoForm__select"
            >
              {shipAreaOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="w-50 w-md-100">
            <input
              className="checkoutInfoForm__input"
              {...register('shippingAddress')}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutInfoForm;
