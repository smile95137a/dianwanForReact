import { MSelect } from '@/components/frontend/FormSelect';
import MCard from '@/components/frontend/MCard';
import { getAllCityNames } from '@/services/frontend/taiwanCitiesService';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const [cityOptions, setCityOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [areaOptions, setAreaOptions] = useState<
    { value: string; label: string }[]
  >([{ value: '', label: '行政區' }]);

  useEffect(() => {
    const cities = getAllCityNames();
    setCityOptions([
      { value: '', label: '縣市' },
      ...cities.map((city) => ({ value: city, label: city })),
    ]);
  }, []);

  const handleRegisterClick = () => {
    navigate('/member-center');
  };

  return (
    <div className="register">
      <MCard customClass="mcard--register" title="註冊會員">
        <div className="register__container">
          <div className="register__main">
            <div className="register__form">
              <div className="register__form-inputs">
                <p className="register__text register__text--required">信箱</p>
                <input className="register__form-input" />
                <p className="register__text register__text--error"></p>
              </div>
              <div className="register__form-inputs m-t-20">
                <p className="register__text register__text--required">密碼</p>
                <input className="register__form-input" type="password" />
                <p className="register__text register__text--error"></p>
              </div>
              <div className="register__form-inputs m-t-20">
                <p className="register__text register__text--required">
                  確認密碼
                </p>
                <input className="register__form-input" type="password" />
                <p className="register__text register__text--error"></p>
              </div>
              <div className="register__form-inputs m-t-20">
                <p className="register__text register__text--required">手機</p>
                <input className="register__form-input" />
                <p className="register__text register__text--error"></p>
              </div>
            </div>
            <div className="register__divider">
              <div className="register__divider-line"></div>
            </div>
            <div className="register__form">
              <div className="register__form-inputs">
                <p className="register__text register__text--required">暱稱</p>
                <input className="register__form-input" />
                <p className="register__text register__text--error"></p>
              </div>
              <div className="register__form-inputs m-t-20">
                <p className="register__text register__text--required">
                  LINE ID
                </p>
                <input className="register__form-input" />
                <p className="register__text register__text--error"></p>
              </div>
              <div className="register__form-inputs m-t-20">
                <p className="register__text">收貨姓名</p>
                <input className="register__form-input" />
                <p className="register__text register__text--error"></p>
              </div>
              <div className="register__form-inputs--addr">
                <div className="register__form-inputs w-50 m-t-20">
                  <p className="register__text">收貨地址</p>
                  <select className={`register__form-input`}>
                    {cityOptions.map((city) => (
                      <option key={city.value} value={city.value}>
                        {city.label}
                      </option>
                    ))}
                  </select>
                  <p className="register__text register__text--error"></p>
                </div>
                <div className="register__form-inputs w-50 m-t-20">
                  <select className={`register__form-input `}>
                    {areaOptions.map((area) => (
                      <option key={area.value} value={area.value}>
                        {area.label}
                      </option>
                    ))}
                  </select>
                  <p className="register__text register__text--error"></p>
                </div>
              </div>

              <div className="register__form-inputs m-t-20">
                <p className="register__text">詳細地址</p>
                <input className="register__form-input" />
                <p className="register__text register__text--error"></p>
              </div>
            </div>
          </div>
          <div className="register__other">
            <div className="register__checkbox">
              <input id="agreeTerms" type="checkbox" />
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
            <p className="register__text register__text--error"></p>
            <div className="register__other-btn">
              <button
                type="button"
                onClick={handleRegisterClick}
                className="register__btn"
              >
                註冊成為會員
              </button>
            </div>
          </div>
        </div>
      </MCard>
    </div>
  );
};

export default Register;
