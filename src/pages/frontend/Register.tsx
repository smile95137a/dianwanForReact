import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import {
  getAllCityNames,
  getAreaListByCityName,
  getZipCodeByCityAndAreaName,
} from '@/services/frontend/taiwanCitiesService';
import MCard from '@/components/frontend/MCard';
import { useLoading } from '@/context/frontend/LoadingContext';
import { registerUser } from '@/services/frontend/userService';
import { useFrontendDialog } from '@/context/frontend/useFrontedDialog';

const schema = yup.object({
  username: yup.string().required('請輸入用戶名'),
  password: yup.string().required('請輸入密碼').min(6, '密碼長度至少6位'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], '密碼不一致')
    .required('請再次輸入密碼'),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]{10}$/, '手機號碼格式不正確')
    .required('請輸入手機號碼'),
  nickname: yup.string().required('請輸入暱稱'),
  addressName: yup.string().nullable(),
  city: yup.string().nullable(),
  area: yup.string().nullable(),
  zipCode: yup.string().nullable(),
  address: yup.string().nullable(),
  lineId: yup.string().required('請輸入 LINE ID'),
  agreeTerms: yup
    .boolean()
    .oneOf([true], '您必須同意網站服務條款和隱私權政策。'),
});

const Register = () => {
  const navigate = useNavigate();
  const { openInfoDialog } = useFrontendDialog();
  const { setLoading } = useLoading();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      nickname: '',
      addressName: '',
      zipCode: '',
      city: '',
      area: '',
      address: '',
      lineId: '',
      agreeTerms: false,
    },
  });

  const [cityOptions, setCityOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [areaOptions, setAreaOptions] = useState<
    { value: string; label: string }[]
  >([{ value: '', label: '行政區' }]);

  // 監控城市和行政區的變化
  const selectedCity = watch('city');
  const selectedArea = watch('area');

  // 初始化縣市選項
  useEffect(() => {
    const cities = getAllCityNames();
    setCityOptions([
      { value: '', label: '縣市' },
      ...cities.map((city) => ({ value: city, label: city })),
    ]);
  }, []);

  // 當城市改變時動態更新行政區
  useEffect(() => {
    if (selectedCity) {
      setValue('area', ''); // 重置行政區
      const areas = getAreaListByCityName(selectedCity);
      setAreaOptions([
        { value: '', label: '行政區' },
        ...areas.map((area) => ({
          value: area.areaName,
          label: area.areaName,
        })),
      ]);
    } else {
      setAreaOptions([{ value: '', label: '行政區' }]);
    }
  }, [selectedCity, setValue]);

  // 當行政區改變時自動填入郵遞區號
  useEffect(() => {
    if (selectedArea) {
      const zipCode = getZipCodeByCityAndAreaName(selectedCity, selectedArea);
      if (zipCode) {
        setValue('zipCode', zipCode);
      } else {
        setValue('zipCode', '');
      }
    } else {
      setValue('zipCode', '');
    }
  }, [selectedArea, selectedCity, setValue]);

  const onSubmit = async (values: any) => {
    try {
      setLoading(true);
      const { success, data, code, message } = await registerUser(values);
      setLoading(false);

      if (success) {
        await openInfoDialog(
          '系統消息',
          '恭喜您，註冊成功！我們很高興您成為我們的一員，請檢查您的信箱以完成後續步驟。'
        );
        navigate('/main');
      } else {
        await openInfoDialog('系統消息', message);
      }
    } catch (error) {
      setLoading(false);
      await openInfoDialog('系統消息', '系統問題，請稍後再嘗試。');
      console.error('登入失敗:', error);
    }
  };

  return (
    <form className="register" onSubmit={handleSubmit(onSubmit)}>
      <MCard customClass="mcard--register" title="註冊會員">
        <div className="register__container">
          <div className="register__main">
            <div className="register__form">
              <div className="register__form-inputs">
                <p className="register__text register__text--required">信箱</p>
                <input
                  className={`register__form-input ${
                    errors.username ? 'input-error' : ''
                  }`}
                  {...register('username')}
                />
                <p className="register__text register__text--error">
                  {errors.username?.message}
                </p>
              </div>
              <div className="register__form-inputs m-t-20">
                <p className="register__text register__text--required">密碼</p>
                <input
                  type="password"
                  className={`register__form-input ${
                    errors.password ? 'input-error' : ''
                  }`}
                  {...register('password')}
                />
                <p className="register__text register__text--error">
                  {errors.password?.message}
                </p>
              </div>
              <div className="register__form-inputs m-t-20">
                <p className="register__text register__text--required">
                  確認密碼
                </p>
                <input
                  className={`register__form-input ${
                    errors.confirmPassword ? 'input-error' : ''
                  }`}
                  {...register('confirmPassword')}
                />
                <p className="register__text register__text--error">
                  {errors.confirmPassword?.message}
                </p>
              </div>
              <div className="register__form-inputs m-t-20">
                <p className="register__text register__text--required">手機</p>
                <input
                  className={`register__form-input ${
                    errors.phoneNumber ? 'input-error' : ''
                  }`}
                  {...register('phoneNumber')}
                />
                <p className="register__text register__text--error">
                  {errors.phoneNumber?.message}
                </p>
              </div>
            </div>
            <div className="register__divider">
              <div className="register__divider-line"></div>
            </div>
            <div className="register__form">
              <div className="register__form-inputs">
                <p className="register__text register__text--required">暱稱</p>
                <input
                  className={`register__form-input ${
                    errors.nickname ? 'input-error' : ''
                  }`}
                  {...register('nickname')}
                />
                <p className="register__text register__text--error">
                  {errors.nickname?.message}
                </p>
              </div>
              <div className="register__form-inputs m-t-20">
                <p className="register__text register__text--required">
                  LINE ID
                </p>
                <input
                  className={`register__form-input ${
                    errors.lineId ? 'input-error' : ''
                  }`}
                  {...register('lineId')}
                />
                <p className="register__text register__text--error">
                  {errors.lineId?.message}
                </p>
              </div>
              <div className="register__form-inputs m-t-20">
                <p className="register__text">收貨姓名</p>
                <input
                  className={`register__form-input ${
                    errors.addressName ? 'input-error' : ''
                  }`}
                  {...register('addressName')}
                />
                <p className="register__text register__text--error">
                  {errors.addressName?.message}
                </p>
              </div>
              <div className="register__form-inputs--addr">
                <div className="register__form-inputs w-50 m-t-20">
                  <p className="register__text">收貨地址</p>
                  <select
                    className={`register__form-input ${
                      errors.city ? 'input-error' : ''
                    }`}
                    {...register('city')}
                  >
                    {cityOptions.map((city) => (
                      <option key={city.value} value={city.value}>
                        {city.label}
                      </option>
                    ))}
                  </select>
                  <p className="register__text register__text--error">
                    {errors.city?.message}
                  </p>
                </div>
                <div className="register__form-inputs w-50 m-t-20">
                  <select
                    className={`register__form-input ${
                      errors.area ? 'input-error' : ''
                    }`}
                    {...register('area')}
                  >
                    {areaOptions.map((area) => (
                      <option key={area.value} value={area.value}>
                        {area.label}
                      </option>
                    ))}
                  </select>
                  <p className="register__text register__text--error">
                    {errors.area?.message}
                  </p>
                </div>
              </div>

              <div className="register__form-inputs m-t-20">
                <p className="register__text">詳細地址</p>
                <input
                  className={`register__form-input ${
                    errors.area ? 'input-error' : ''
                  }`}
                  {...register('address')}
                />
                <p className="register__text register__text--error">
                  {errors.address?.message}
                </p>
              </div>
            </div>
          </div>
          <div className="register__other">
            <div className="register__checkbox">
              <input
                id="agreeTerms"
                type="checkbox"
                {...register('agreeTerms')}
              />
              <label htmlFor="agreeTerms">
                我同意 <u>電玩賞</u> 提供的
                <u>
                  <a href="./policy" target="_blank">
                    網站服務條款
                  </a>
                </u>
                與
                <u>
                  <a href="./privacy" target="_blank">
                    隱私權政策
                  </a>
                </u>
                。
              </label>
            </div>
            <p className="register__text register__text--error">
              {errors.agreeTerms?.message}
            </p>

            <div className="register__other-btn">
              <button
                type="submit"
                disabled={isSubmitting}
                className="register__btn"
              >
                {isSubmitting ? '提交中...' : '註冊'}
              </button>
            </div>
          </div>
        </div>
      </MCard>
    </form>
  );
};

export default Register;
