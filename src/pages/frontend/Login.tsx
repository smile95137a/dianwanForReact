import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import googleLogo from '@/assets/image/google.svg';
import logo from '@/assets/image/logo.png';
import { getLoginUrl } from '@/utils/AuthUtils';
import MCard from '@/components/frontend/MCard';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const forwardRegistration = () => {
    navigate('/register');
  };

  const handleOauthLogin = (provider: string) => {
    window.location.href = getLoginUrl(provider);
  };

  return (
    <div className="login">
      <MCard customClass="mcard--login" title="會員登入">
        <div className="login__container">
          <div className="login__main">
            <form className="login__form">
              <div className="login__auth">
                <div
                  className="login__auth-btn"
                  onClick={() => handleOauthLogin('google')}
                >
                  <div className="login__auth-btn-icon">
                    <img src={googleLogo} alt="Google logo" />
                  </div>
                  <div className="login__auth-btn-text">Google 帳號登入</div>
                </div>
              </div>

              <div className="login__divider">
                <div className="login__divider-line"></div>
                <div className="login__divider-text">或</div>
              </div>

              <div className="login__form-inputs">
                <p className="login__text">電子信箱</p>
                <input
                  className={`login__form-input `}
                  type="text"
                  name="username"
                />
              </div>

              <div className="login__form-inputs">
                <p className="login__text">密碼</p>
                <input
                  className={`login__form-input `}
                  type="password"
                  name="password"
                />
              </div>

              <div className="login__forgot">
                <p className="login__text login__text--forgot">忘記密碼?</p>
              </div>

              <div className="login__btns">
                <button type="submit" className="login__btn">
                  登入
                </button>
              </div>
            </form>

            <div className="login__other">
              <div className="login__other-img">
                <img src={logo} />
              </div>
              <div className="login__other-info">
                <p className="login__text"> 歡迎來到 電玩賞 官方網站!</p>
                <p className="login__text">立即註冊，開啟更多專屬功能！</p>
              </div>
              <div className="login__other-btn">
                <div className="login__btn" onClick={forwardRegistration}>
                  註冊
                </div>
              </div>
            </div>
          </div>
        </div>
      </MCard>
    </div>
  );
};

export default Login;
