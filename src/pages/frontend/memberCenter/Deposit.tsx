import NumberFormatter from '@/components/common/NumberFormatter';
import CircleIcon from '@/components/frontend/CircleIcon';
import { BsHandbag } from 'react-icons/bs';
import React, { useEffect, useState } from 'react';
import coinImg from '@/assets/image/coin.png';
import payCardImg from '@/assets/image/pay-card.png';
import payApplePayImg from '@/assets/image/pay-apple.png';
import { useForm } from 'react-hook-form';
import { useLoading } from '@/context/frontend/LoadingContext';
import { topUp } from '@/services/frontend/paymentService';
import { useFrontendDialog } from '@/context/frontend/useFrontedDialog';
import {
  generateBaseFormData,
  generateCheckMacValue,
  createAndSubmitForm,
} from '@/utils/EcpayUtils';
const invoiceInfoOptions = [
  { value: '', label: '請選擇發票資訊' },
  { value: 'donation', label: '捐贈發票' },
  { value: 'mobileCarrier', label: '手機載具' },
  { value: 'personalEInvoice', label: '個人電子發票' },
];
const Deposit = () => {
  const depositList = [
    { id: 'deposit1', value: '100', num: '100' },
    { id: 'deposit2', value: '200', num: '200' },
    { id: 'deposit3', value: '300', num: '300' },
    { id: 'deposit4', value: '500', num: '500' },
    { id: 'deposit5', value: '1000', num: '1000' },
    { id: 'deposit6', value: '2000', num: '2000' },
    { id: 'deposit7', value: '3000', num: '3000' },
    { id: 'deposit8', value: '5000', num: '5000' },
    { id: 'deposit9', value: '10000', num: '10000' },
    { id: 'deposit10', value: '20000', num: '20000' },
    { id: 'deposit12', value: '30000', num: '30000' },
    { id: 'deposit12', value: '50000', num: '50000' },
  ];
  const payList = [
    { id: 'pay1', label: '信用卡', value: 'credit', img: payCardImg },
    { id: 'pay3', label: '銀行轉帳', value: 'bank', img: payCardImg },
  ];
  const { openInfoDialog, openRestPwdDialog } = useFrontendDialog();
  const [selectedDeposits, setSelectedDeposits] = useState([]);
  const [total, setTotal] = useState(0);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('');
  const { setLoading } = useLoading();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      invoiceInfo: '',
      invoiceEmail: '',
    },
  });

  const handleCheckboxChange = (id, value) => {
    setSelectedDeposits((prev) => {
      const isChecked = prev.find((item) => item.id === id);
      if (isChecked) {
        return prev.filter((item) => item.id !== id);
      } else {
        return [...prev, { id, value: parseInt(value, 10) }];
      }
    });
  };

  useEffect(() => {
    const totalAmount = selectedDeposits.reduce(
      (sum, item) => sum + item.value,
      0
    );
    setTotal(totalAmount);
  }, [selectedDeposits]);

  const isActive = (id) => selectedDeposits.some((item) => item.id === id);

  const handleNextStep = () => {
    if (step === 1 && total === 0) {
      alert('請選擇金額');
      return;
    }
    setStep(2);
  };

  const handleBackStep = () => {
    setStep(1);
  };
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const { success, data, code, message } = await topUp({
        paymentMethod: 1,
        amount: total,
      });
      setLoading(false);

      if (success) {
        if (paymentMethod === 'credit') {
          const formData = generateBaseFormData(total);
          formData.MerchantTradeNo = data;
          formData.ChoosePayment = 'Credit';
          formData.ReturnURL =
            'http://13.208.176.189:8081/payment/paymentCallback2';
          formData.TradeDesc = `儲值 - 信用卡結帳 ${data}`;
          formData.ItemName = `儲值 ${'信用卡'}`;
          const cmv = generateCheckMacValue(formData);

          createAndSubmitForm(
            'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5',
            { ...formData, CheckMacValue: cmv }
          );
        } else if (paymentMethod === 'bank') {
          const formData = generateBaseFormData(total);
          formData.MerchantTradeNo = data;
          formData.ChoosePayment = 'ATM';
          formData.ReturnURL =
            'http://13.208.176.189:8081/payment/paymentCallback2';
          formData.TradeDesc = `儲值 - ATM ${data}`;
          formData.ItemName = `儲值 ${'ATM'}`;
          const cmv = generateCheckMacValue(formData);
          createAndSubmitForm(
            'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5',
            { ...formData, CheckMacValue: cmv }
          );
        }
      } else {
        await openInfoDialog('系統消息', message);
      }
    } catch (error) {
      setLoading(false);
      console.error('登入失敗:', error);
      await openInfoDialog('系統消息', '系統問題，請稍後再嘗試。');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="deposit">
        <div className="deposit__header">
          <div className="deposit__header-title">
            <div className="deposit__icon">
              <CircleIcon icon={BsHandbag} />
            </div>
            <p className="deposit__text">購買代幣</p>
          </div>
        </div>
        {step === 1 && (
          <>
            <div className="deposit__step">
              <p className="deposit__text">
                STEP 1. 選擇代幣數量，並確認應付金額
              </p>
            </div>
            <div className="deposit__list  m-y-48">
              {depositList.map((item) => (
                <div className="deposit__priceBox">
                  <div
                    key={item.id}
                    className={`deposit__item ${
                      isActive(item.id) ? 'active' : ''
                    }`}
                    onClick={() => handleCheckboxChange(item.id, item.value)}
                  >
                    <label style={{ display: 'none' }}>
                      <input
                        type="checkbox"
                        value={item.value}
                        onChange={(e) =>
                          handleCheckboxChange(item.id, e.target.value)
                        }
                      />
                    </label>
                    <div className="deposit__item-img">
                      <img src={coinImg} alt="coin" />
                    </div>
                    <div className="deposit__item-price deposit__item-price--top">
                      <span className="deposit__value">
                        <NumberFormatter number={~~item.value} />
                      </span>
                    </div>
                    <div className="deposit__item-price  deposit__item-price--bottom">
                      <span className="deposit__value">
                        <NumberFormatter number={~~item.value} />
                      </span>
                    </div>
                  </div>
                  <span className="deposit__text">
                    代幣
                    <NumberFormatter number={~~item.value} />點
                  </span>
                </div>
              ))}
            </div>
            <div className="deposit__total m-y-24">
              <p className="deposit__text">金額總計</p>
              <div className="deposit__total-box">
                <NumberFormatter number={~~total} />元
              </div>
            </div>
            <button onClick={handleNextStep} className="deposit__btn m-y-24">
              下一步
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="deposit__step">
              <p className="deposit__text">STEP 2. 選擇付款方式＆發票資訊</p>
            </div>
            <div className="deposit__form  m-y-48">
              <div className="flex gap-x-24">
                <div className="w-50">
                  <div className="flex gap-x-24">
                    <div className="w-50">
                      <p className="deposit__text">發票資訊</p>
                      <select
                        {...register('invoiceInfo')}
                        className={`deposit__form-input ${
                          errors.invoiceInfo ? 'deposit__form-input--error' : ''
                        }`}
                      >
                        {invoiceInfoOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-50">
                      <p className="deposit__text">接受發票信箱</p>
                      <input
                        className={`deposit__form-input ${
                          errors.invoiceEmail ? 'error' : ''
                        }`}
                        type="text"
                        placeholder="請輸入電子信箱"
                        {...register('invoiceEmail', {
                          required: '請填寫發票信箱',
                        })}
                      />
                      {errors.invoiceEmail && (
                        <p className="error-text">
                          {errors.invoiceEmail.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="deposit__pay m-y-24">
              <p className="deposit__text">選擇付款方式，完成付款 *</p>

              <div className="deposit__payList m-y-48">
                {payList.map((item) => (
                  <div
                    key={item.id}
                    className={`deposit__item deposit__item--pay ${
                      paymentMethod === item.value ? 'active' : ''
                    }`}
                    onClick={() => setPaymentMethod(item.value)}
                  >
                    <div className="deposit__item-box">
                      <div className="deposit__item-img deposit__item-img--pay">
                        <img src={item.img} alt={item.label} />
                      </div>
                      <div className="deposit__item-label deposit__item-label--pay flex-1">
                        {item.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="deposit__notice gap-y-6">
              <p className="deposit__text">
                本服務由第三方支付夥伴提供，點擊選項將導至第三方金流系統完成付款交易。
              </p>
              <p className="deposit__text">代幣僅供本網站會員購物之用。</p>
              <p className="deposit__text">購買時如有相關問題，請聯繫客服。</p>
              <p className="deposit__text">
                購買代幣所產生每筆服務費由消費者支付。
              </p>
            </div>
            <div className="deposit__actions">
              <button
                onClick={handleBackStep}
                className="deposit__btn deposit__btn--back"
              >
                回上一步
              </button>
              <button
                type="submit"
                className="deposit__btn deposit__btn--confirm"
              >
                確認
              </button>
            </div>
          </>
        )}
      </div>
    </form>
  );
};

export default Deposit;
