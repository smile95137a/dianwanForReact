import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  getUserInfo,
  updateUserInvoice,
} from '@/services/frontend/userService';
import { useFrontendDialog } from '@/context/frontend/useFrontedDialog';
import { useLoading } from '@/context/frontend/LoadingContext';

// Invoice information options
const invoiceInfoOptions = [
  { value: '', label: '請選擇發票資訊' },
  { value: 'donation', label: '捐贈發票' },
  { value: 'mobileCarrier', label: '手機載具' },
  { value: 'personalEInvoice', label: '個人電子發票' },
];

// Validation schema
const validationSchema = yup.object().shape({
  invoiceInfo: yup.string().required('請選擇發票資訊'),
  invoiceInfoEmail: yup
    .string()
    .email('請輸入有效的電子郵件')
    .required('接收發票信箱為必填項'),
  vehicle: yup.string().required('載具條碼為必填項'),
});

const ProfileEditInvoiceForm = () => {
  const { setLoading } = useLoading();
  const { openInfoDialog } = useFrontendDialog();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      invoiceInfo: '',
      invoiceInfoEmail: '',
      vehicle: '',
    },
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const { data: userInfo } = await getUserInfo();
        console.log(userInfo);

        setValue('invoiceInfo', userInfo.invoiceInfo || '');
        setValue('invoiceInfoEmail', userInfo.invoiceInfoEmail || '');
        setValue('vehicle', userInfo.vehicle || '');
      } catch (error) {
        console.error('获取用户信息失败:', error);
      }
    };

    fetchInitialData();
  }, [setValue]);

  const onSubmit = async (values: any) => {
    try {
      setLoading(true);
      const { success } = await updateUserInvoice(values);
      setLoading(false);

      if (success) {
        await openInfoDialog('系統通知', '更新成功');
      } else {
        await openInfoDialog('系統通知', '更新失敗');
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      await openInfoDialog('系統通知', '更新失敗，系統出錯');
    }
  };

  return (
    <form className="profileEditInvoiceForm" onSubmit={handleSubmit(onSubmit)}>
      <div className="profileEditInvoiceForm__title">
        <p className="profileEditInvoiceForm__text">發票資料修改</p>
      </div>

      <div className="profileEditInvoiceForm__main gap-x-12">
        {/* Invoice Info */}
        <div className="profileEditInvoiceForm__form-inputs m-t-20">
          <p className="profileEditInvoiceForm__text profileEditInvoiceForm__text--required">
            發票資訊
          </p>
          <select
            {...register('invoiceInfo')}
            className={`profileEditInvoiceForm__form-input ${
              errors.invoiceInfo
                ? 'profileEditInvoiceForm__form-input--error'
                : ''
            }`}
          >
            {invoiceInfoOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="profileEditInvoiceForm__text profileEditInvoiceForm__text--error">
            {errors.invoiceInfo?.message}
          </span>
        </div>

        {/* Invoice Email */}
        <div className="profileEditInvoiceForm__form-inputs m-t-20">
          <p className="profileEditInvoiceForm__text profileEditInvoiceForm__text--required">
            接收發票信箱
          </p>
          <input
            type="email"
            {...register('invoiceInfoEmail')}
            className={`profileEditInvoiceForm__form-input ${
              errors.invoiceInfoEmail
                ? 'profileEditInvoiceForm__form-input--error'
                : ''
            }`}
          />
          <span className="profileEditInvoiceForm__text profileEditInvoiceForm__text--error">
            {errors.invoiceInfoEmail?.message}
          </span>
        </div>

        {/* Vehicle */}
        <div className="profileEditInvoiceForm__form-inputs m-t-20">
          <p className="profileEditInvoiceForm__text profileEditInvoiceForm__text--required">
            載具條碼
          </p>
          <input
            type="text"
            {...register('vehicle')}
            className={`profileEditInvoiceForm__form-input ${
              errors.vehicle ? 'profileEditInvoiceForm__form-input--error' : ''
            }`}
          />
          <span className="profileEditInvoiceForm__text profileEditInvoiceForm__text--error">
            {errors.vehicle?.message}
          </span>
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
