import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import NumberFormatter from '@/components/common/NumberFormatter';
import sha256 from 'crypto-js/sha256';
import moment from 'moment';
import coinImg from '@/assets/image/coin.png';

const Deposit = () => {
  const depositList = [
    { id: 'deposit1', value: '1000', num: '1000' },
    { id: 'deposit2', value: '3000', num: '3000' },
    { id: 'deposit3', value: '5000', num: '5000' },
    { id: 'deposit4', value: '8000', num: '8000' },
    { id: 'deposit5', value: '10000', num: '10000' },
    { id: 'deposit6', value: '20000', num: '20000' },
    { id: 'deposit7', value: '30000', num: '30000' },
    { id: 'deposit8', value: '50000', num: '50000' },
  ];

  const validationSchema = yup.object({
    amount: yup.string().required('請選擇儲值金額'),
  });

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      amount: '',
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const onSubmit = async (values) => {
    const formData = {
      MerchantID: '3002607',
      MerchantTradeNo: `Test${Date.now()}`,
      MerchantTradeDate: moment().format('YYYY/MM/DD HH:mm:ss'),
      PaymentType: 'aio',
      TotalAmount: values.amount,
      TradeDesc: 'test',
      ItemName: 'item',
      ReturnURL: 'http://13.208.176.189:8081/payment/paymentCallback2',
      ChoosePayment: 'ALL',
      EncryptType: 1,
    };

    const checkMacValue = generateCheckMacValue(formData);
    const obj = { ...formData, CheckMacValue: checkMacValue };
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5';

    Object.keys(obj).forEach((key) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = obj[key];
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  const generateCheckMacValue = (formData) => {
    const sortedKeys = Object.keys(formData).sort();
    const rawData = sortedKeys
      .map((key) => `${key}=${formData[key]}`)
      .join('&');
    const hashKey = 'pwFHCqoQZGmho4w6';
    const hashIV = 'EkRm7iFT261dpevs';
    const encodedData = `HashKey=${hashKey}&${rawData}&HashIV=${hashIV}`;
    let urlEncodedData = encodeURIComponent(encodedData);
    urlEncodedData = urlEncodedData.replace(/%20/g, '+');
    const hashValue = sha256(urlEncodedData.toLowerCase())
      .toString()
      .toUpperCase();

    return hashValue;
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="profileEditForm">
        <div className="deposit p-24">
          <div className="deposit__title">
            <div className="deposit__text" data-text="購買代幣">
              購買代幣
            </div>
          </div>
          <div className="deposit__list">
            <div className="deposit__list-items">
              {depositList.map((deposit) => (
                <label
                  key={deposit.id}
                  htmlFor={deposit.id}
                  className={`deposit__item ${
                    methods.watch('amount') === deposit.value ? 'active' : ''
                  }`}
                >
                  <input
                    type="radio"
                    id={deposit.id}
                    value={deposit.value}
                    className={`deposit__item-radio ${
                      errors.amount ? 'input-error' : ''
                    }`}
                    {...register('amount', { required: '請選擇儲值金額' })}
                  />

                  <div className="deposit__item-num">
                    <div className="deposit__item-icon">
                      <img src={coinImg} />
                    </div>
                    <NumberFormatter number={~~deposit.num} />
                  </div>
                </label>
              ))}
            </div>
          </div>
          {errors.amount && (
            <p className="error-message">{errors.amount.message}</p>
          )}
          <div className="deposit__btns">
            <button className="deposit__btn" type="submit">
              確認
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default Deposit;
