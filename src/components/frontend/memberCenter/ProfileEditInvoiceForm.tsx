import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';

const invoiceInfoOptions = [
  { value: '', label: '請選擇發票資訊' },
  { value: 'donation', label: '捐贈發票' },
  { value: 'mobileCarrier', label: '手機載具' },
  { value: 'personalEInvoice', label: '個人電子發票' },
];

const ProfileEditInvoiceForm = () => {
  const fetchUserInfo = async () => {};

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <form className="profileEditInvoiceForm">
      <div className="profileEditInvoiceForm__title">
        <p className="profileEditInvoiceForm__text">發票資料修改</p>
      </div>

      <div className="profileEditInvoiceForm__main">
        <div className="profileEditInvoiceForm__form-inputs m-t-20">
          <p className="profileEditInvoiceForm__text profileEditInvoiceForm__text--required">
            發票資訊
          </p>

          <select className={`mselect--invoiceForm `}>
            {invoiceInfoOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="profileEditInvoiceForm__text profileEditInvoiceForm__text--error"></span>
        </div>

        <div className="profileEditInvoiceForm__form-inputs m-t-20">
          <p className="profileEditInvoiceForm__text profileEditInvoiceForm__text--required">
            接收發票信箱
          </p>
          <input
            type="text"
            className={`profileEditInvoiceForm__form-input `}
          />
          <span className="profileEditInvoiceForm__text profileEditInvoiceForm__text--error"></span>
        </div>

        <div className="profileEditInvoiceForm__form-inputs m-t-20">
          <p className="profileEditInvoiceForm__text profileEditInvoiceForm__text--required">
            載具條碼
          </p>
          <input
            type="text"
            className={`profileEditInvoiceForm__form-input `}
          />
          <span className="profileEditInvoiceForm__text profileEditInvoiceForm__text--error"></span>
        </div>
      </div>

      <div className="profileEditInvoiceForm__btns">
        <button type="submit" className="profileEditInvoiceForm__btn">
          <span className="profileEditInvoiceForm__text"> 確認修改 </span>
        </button>
      </div>
    </form>
  );
};

export default ProfileEditInvoiceForm;
