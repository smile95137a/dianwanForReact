import Card from '@/components/frontend/MCard';
import React from 'react';

const Login = () => {
  return (
    <div className="login">
      <Card
        title="登入"
        customClass="mcard--login"
        content={
          <div className="login__container">
            <div className="login__main">
              <div className="login__tab">
                <div className="login__tab-btn login__tab-btn--phone login__tab-btn--active">
                  手機
                </div>
                <div className="login__tab-btn login__tab-btn--mail">信箱</div>
              </div>

              <div className="login__form grid">
                <div className="col-100 m-t-16">
                  <p className="login__text">帳號</p>
                  <input type="text" className="login__form-input" />
                </div>
                <div className="col-100 m-t-16">
                  <p className="login__text">密碼</p>
                  <input type="text" className="login__form-input" />
                </div>
              </div>

              <div className="login__forgot">
                <p className="login__text login__text--forgot">忘記密碼?</p>
              </div>

              <div className="login__btns">
                <div className="login__btn">登入</div>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default Login;
