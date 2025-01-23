import moment from 'moment';
import sha256 from 'crypto-js/sha256';
import { genRandom } from './RandomUtils';

const MERCHANT_ID = import.meta.env.VITE_MERCHANT_ID || '';
const HASH_KEY = import.meta.env.VITE_HASH_KEY || '';
const HASH_IV = import.meta.env.VITE_HASH_IV || '';

export const generateCheckMacValue = (
  formData: Record<string, any>
): string => {
  const sortedKeys = Object.keys(formData).sort();
  const rawData = sortedKeys.map((key) => `${key}=${formData[key]}`).join('&');

  const encodedData = `HashKey=${HASH_KEY}&${rawData}&HashIV=${HASH_IV}`;
  let urlEncodedData = encodeURIComponent(encodedData);
  urlEncodedData = urlEncodedData.replace(/%20/g, '+');

  const hashValue = sha256(urlEncodedData.toLowerCase())
    .toString()
    .toUpperCase();

  return hashValue;
};

export const createAndSubmitForm = (
  actionUrl: string,
  formData: Record<string, any>
): void => {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = actionUrl;

  Object.keys(formData).forEach((key) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = formData[key];
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};

export const generateBaseFormData = (amount: number): Record<string, any> => {
  return {
    MerchantID: MERCHANT_ID,
    MerchantTradeNo: ``,
    MerchantTradeDate: moment().format('YYYY/MM/DD HH:mm:ss'),
    PaymentType: 'aio',
    TotalAmount: amount,
    TradeDesc: '',
    ItemName: '',
    ReturnURL: '',
    ChoosePayment: '',
    EncryptType: 1,
  };
};

export const onSubmit = async (values: { amount: number }): Promise<void> => {
  const formData = generateBaseFormData(values.amount);
  const checkMacValue = generateCheckMacValue(formData, HASH_KEY, HASH_IV);
  const obj = { ...formData, CheckMacValue: checkMacValue };

  createAndSubmitForm(
    'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5',
    obj
  );
};
