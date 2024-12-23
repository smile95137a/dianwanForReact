import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import googleLogo from '@/assets/image/google.svg';
import logo from '@/assets/image/logo.png';
import { getLoginUrl } from '@/utils/AuthUtils';
import MCard from '@/components/frontend/MCard';
import { useForm } from 'react-hook-form';
import { useLoading } from '@/context/frontend/LoadingContext';
import { login } from '@/services/frontend/AuthService';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, setUser } from '@/store/slices/frontend/authSlice';
import { RootState } from '@/store';
import { useFrontendDialog } from '@/context/frontend/useFrontedDialog';

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { openInfoDialog, openAnimateDialog } = useFrontendDialog();
  const { setLoading } = useLoading();

  const isLogin = useSelector(
    (state: RootState) => state.frontend.auth.isLogin
  );

  useEffect(() => {
    if (isLogin) {
      navigate('/main');
    }
  }, [isLogin, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const forwardRegistration = () => {
    navigate('/register');
  };

  const handleOauthLogin = (provider: string) => {
    window.location.href = getLoginUrl(provider);
  };

  const onSubmit = async (values: any) => {
    try {
      setLoading(true);
      const { success, data, code, message } = await login(values);
      setLoading(false);

      if (success) {
        dispatch(setUser(data.user));
        dispatch(setToken(data.accessToken));
        navigate('/main');
      } else {
        alert(message);
        // 顯示對話框通知用戶
        // await dialogStore.openInfoDialog({
        //   title: '系統通知',
        //   message,
        // });
      }
    } catch (error) {
      setLoading(false);

      // await dialogStore.openInfoDialog({
      //   title: '系統通知',
      //   message: '系統問題，請稍後再嘗試。',
      // });

      console.error('登入失敗:', error);
    }
  };

  return (
    <div className="login">
      <MCard customClass="mcard--login" title="會員登入">
        <div className="login__container">
          <div className="login__main">
            <form className="login__form" onSubmit={handleSubmit(onSubmit)}>
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
                  className={`login__form-input ${
                    errors.username ? 'input-error' : ''
                  }`}
                  type="text"
                  {...register('username', { required: '電子信箱是必填項' })}
                  placeholder="請輸入電子信箱"
                />
                {errors.username && (
                  <p className="error-text">{errors.username.message}</p>
                )}
              </div>

              <div className="login__form-inputs">
                <p className="login__text">密碼</p>
                <input
                  className={`login__form-input ${
                    errors.password ? 'input-error' : ''
                  }`}
                  type="password"
                  {...register('password', { required: '密碼是必填項' })}
                  placeholder="請輸入密碼"
                />
                {errors.password && (
                  <p className="error-text">{errors.password.message}</p>
                )}
              </div>

              <div className="login__forgot">
                <p className="login__text login__text--forgot">忘記密碼?</p>
              </div>

              <div className="login__btns">
                <button
                  type="submit"
                  className="login__btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '登入中...' : '登入'}
                </button>
              </div>
            </form>

            <div className="login__other">
              <div className="login__other-img">
                <img src={logo} alt="Logo" />
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
