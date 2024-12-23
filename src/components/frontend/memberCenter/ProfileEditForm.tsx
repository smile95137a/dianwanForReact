import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import {
  getAllCityNames,
  getAreaListByCityName,
} from '@/services/frontend/taiwanCitiesService';
import { getUserInfo, updateUser } from '@/services/frontend/userService';
import { useLoading } from '@/context/frontend/LoadingContext';
import { yupResolver } from '@hookform/resolvers/yup';
import { register } from 'module';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useFrontendDialog } from '@/context/frontend/useFrontedDialog';

const ProfileEditForm = () => {
  const [cityOptions, setCityOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [areaOptions, setAreaOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const { openInfoDialog } = useFrontendDialog();

  const schema = yup.object().shape({
    nickname: yup.string().required('暱稱為必填項'),
    addressName: yup.string().required('收貨姓名為必填項'),
    city: yup.string().nullable(),
    area: yup.string().nullable(),
    address: yup.string().nullable(),
    lineId: yup.string().nullable(),
    phoneNumber: yup.string().required('收貨手機為必填項'),
  });

  const methods = useForm({
    defaultValues: {
      invoiceInfo: '',
      invoiceInfoEmail: '',
      vehicle: '',
    },
  });
  const { register, handleSubmit, watch, setValue } = methods;
  const watchCity = watch('city');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const cityNames = getAllCityNames();
        setCityOptions([
          { value: '', label: '縣市' },
          ...cityNames.map((city) => ({ value: city, label: city })),
        ]);
        setAreaOptions([{ value: '', label: '行政區' }]);

        const { data: userInfo } = await getUserInfo();
        setValue('nickname', userInfo.nickname || '');
        setValue('addressName', userInfo.addressName || '');
        setValue('city', userInfo.city || '');
        setTimeout(() => {
          setValue('area', userInfo.area || '');
        }, 0);
        setValue('address', userInfo.address || '');
        setValue('lineId', userInfo.lineId || '');
        setValue('phoneNumber', userInfo.phoneNumber || '');
      } catch (error) {
        console.error('获取用户信息失败:', error);
      }
    };

    fetchInitialData();
  }, [setValue]);

  useEffect(() => {
    if (watchCity) {
      setValue('area', '');
      const areas = getAreaListByCityName(watchCity);
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
  }, [watchCity, setValue]);

  const onSubmit = async (values: any) => {
    try {
      setLoading(true);
      const { success } = await updateUser(values);
      setLoading(false);

      if (success) {
        await openInfoDialog('系統消息', '更新成功');
      } else {
        await openInfoDialog('系統消息', '更新失敗');
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      await openInfoDialog('系統消息', '更新失敗，系統出錯');
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="profileEditForm">
        <div className="profileEditForm__title">
          <p className="profileEditForm__text">會員資料修改</p>
        </div>
        <div className="profileEditForm__main">
          <div className="profileEditForm__form">
            <div className="profileEditForm__form-inputs m-t-20">
              <p className="profileEditForm__text profileEditForm__text--required">
                暱稱
              </p>
              <input
                {...register('nickname')}
                className="profileEditForm__form-input"
              />
              <span className="profileEditForm__text profileEditForm__text--error"></span>
            </div>
            <div className="profileEditForm__form-inputs m-t-20">
              <p className="profileEditForm__text profileEditForm__text--required">
                收貨姓名
              </p>
              <input
                {...register('addressName')}
                className="profileEditForm__form-input"
              />
              <span className="profileEditForm__text profileEditForm__text--error"></span>
            </div>
            <div className="flex flex-column m-t-20">
              <p className="register__text">收貨地址</p>
              <div className="flex gap-x-12">
                <div className="profileEditForm__form-inputs w-50">
                  <select
                    {...register('city')}
                    className="profileEditForm__form-input"
                  >
                    {cityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <span className="register__text register__text--error"></span>
                </div>
                <div className="profileEditForm__form-inputs w-50">
                  <select
                    {...register('area')}
                    className="profileEditForm__form-input"
                  >
                    {areaOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <span className="register__text register__text--error"></span>
                </div>
              </div>
            </div>
            <div className="profileEditForm__form-inputs m-t-20">
              <p className="profileEditForm__text">詳細地址</p>
              <input
                type="text"
                {...register('address')}
                className="profileEditForm__form-input"
              />
              <span className="profileEditForm__text profileEditForm__text--error"></span>
            </div>
          </div>
          <div className="profileEditForm__form profileEditForm__form--other">
            <div className="profileEditForm__form-inputs m-t-20">
              <p className="profileEditForm__text">LINE ID</p>
              <input
                type="text"
                {...register('lineId')}
                className="profileEditForm__form-input"
              />
              <span className="profileEditForm__text profileEditForm__text--error"></span>
            </div>
            <div className="profileEditForm__form-inputs m-t-20">
              <p className="profileEditForm__text profileEditForm__text--required">
                收貨手機
              </p>
              <input
                type="text"
                {...register('phoneNumber')}
                className="profileEditForm__form-input"
              />
              <span className="profileEditForm__text profileEditForm__text--error"></span>
            </div>
          </div>
        </div>
        <div className="profileEditForm__btns">
          <button type="submit" className="profileEditForm__btn">
            <span className="profileEditForm__text">確認修改</span>
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ProfileEditForm;
