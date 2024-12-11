import { useForm } from 'react-hook-form';
import { FaUser, FaEye } from 'react-icons/fa';
import { FormInput } from '@/components/backend/FormInput';
import MButton from '@/components/backend/MButton';
import { login } from '@/services/backend/AuthService';
import { useDispatch } from 'react-redux';
import { setAuthData } from '@/store/slices/backend/authSlice';
import { useNavigate } from 'react-router-dom';
import { saveState } from '@/utils/Localstorage';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { control, handleSubmit, formState, getValues } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async () => {
    if (validateForm()) {
      const formData = getValues();
      try {
        const { success, data, message } = await login(formData);
        if (success) {
          const { accessToken, user } = data;
          dispatch(setAuthData({ accessToken, user }));
          saveState('btoken', accessToken);
          navigate('/admin/main');
        } else {
          console.log(message);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const validateForm = () => {
    const { username, password } = getValues();
    try {
      if (!username) {
        throw new Error('請輸入您的帳號。');
      }
      if (!password) {
        throw new Error('請輸入您的密碼。');
      }
    } catch (error) {
      // if (error instanceof Error) {
      // } else {
      // }
      return false;
    }

    return true;
  };

  return (
    <div className="blogin">
      <div className="blogin__container">
        <div className="blogin__other">
          {/* <img src={logoImg} className="blogin__other-img" /> */}
        </div>
        <div className="blogin__form">
          <div className="blogin__form-items">
            <div className="blogin__form-title">
              <p className="blogin__form-text">Welcome</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-y-4">
                <div className="col-100">
                  <FormInput
                    placeholderText={'帳號'}
                    Icon={FaUser}
                    name="username"
                    control={control}
                  />
                  {formState.errors.username && (
                    <div className="error-message">
                      {formState.errors.username.message}
                    </div>
                  )}
                </div>
                <div className="col-100">
                  <FormInput
                    type="password"
                    placeholderText={'密碼'}
                    Icon={FaEye}
                    name="password"
                    control={control}
                  />
                  {formState.errors.password && (
                    <div className="error-message">
                      {formState.errors.password.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="blogin__form-btns">
                <button className="blogin__btn" type="submit">
                  <span className={`blogin__text `}>登入</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
