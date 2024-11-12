import React, { useEffect, useState } from 'react';
import {
  getAllCityNames,
  getAreaListByCityName,
} from '@/services/frontend/taiwanCitiesService';

const ProfileEditForm = () => {
  const [cityOptions, setCityOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [areaOptions, setAreaOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const fetchUserInfo = async () => {
    try {
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    }
  };

  const onSubmit = async (values: any) => {};

  useEffect(() => {
    const cityNames = getAllCityNames();
    setCityOptions([
      { value: '', label: '縣市' },
      ...cityNames.map((city) => ({ value: city, label: city })),
    ]);
    setAreaOptions([{ value: '', label: '行政區' }]);
    fetchUserInfo();
  }, []);

  const handleCityChange = (city: string) => {
    const areas = getAreaListByCityName(city);
    setAreaOptions([
      { value: '', label: '行政區' },
      ...areas.map((area) => ({ value: area.areaName, label: area.areaName })),
    ]);
  };

  return (
    <div className="profileEditForm">
      <div className="profileEditForm__title">
        <p className="profileEditForm__text">會員資料修改</p>
      </div>
      <form>
        <div className="profileEditForm__main">
          <div className="profileEditForm__form">
            <div className="profileEditForm__form-inputs m-t-20">
              <p className="profileEditForm__text profileEditForm__text--required">
                暱稱
              </p>
              <input className={`profileEditForm__form-input `} />
              <span className="profileEditForm__text profileEditForm__text--error"></span>
            </div>
            <div className="profileEditForm__form-inputs m-t-20">
              <p className="profileEditForm__text profileEditForm__text--required">
                收貨姓名
              </p>
              <input className={`profileEditForm__form-input `} />
              <span className="profileEditForm__text profileEditForm__text--error"></span>
            </div>
            <div className="flex flex-column m-t-20">
              <p className="register__text">收貨地址</p>
              <div className="flex gap-x-12">
                <div className="profileEditForm__form-inputs w-50">
                  <select className="profileEditForm__form-input">
                    {cityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <span className="register__text register__text--error"></span>
                </div>
                <div className="profileEditForm__form-inputs w-50">
                  <select className="profileEditForm__form-input">
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
              <input type="text" className={`profileEditForm__form-input `} />
              <span className="profileEditForm__text profileEditForm__text--error"></span>
            </div>
          </div>
          <div className="profileEditForm__form profileEditForm__form--other">
            <div className="profileEditForm__form-inputs m-t-20">
              <p className="profileEditForm__text">LINE ID</p>
              <input type="text" className={`profileEditForm__form-input `} />
              <span className="profileEditForm__text profileEditForm__text--error"></span>
            </div>
            <div className="profileEditForm__form-inputs m-t-20">
              <p className="profileEditForm__text profileEditForm__text--required">
                收貨手機
              </p>
              <input type="text" className={`profileEditForm__form-input `} />
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
    </div>
  );
};

export default ProfileEditForm;
