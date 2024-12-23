import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MCard from '@/components/frontend/MCard';
import { useForm } from 'react-hook-form';
import { useLoading } from '@/context/frontend/LoadingContext';
import { useFrontendDialog } from '@/context/frontend/useFrontedDialog';
import { resetPassword } from '@/services/frontend/passwordResetService';

const RestPwdForm: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { openInfoDialog } = useFrontendDialog();
  const { setLoading } = useLoading();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const validateForm = async () => {
    const { password, confirmPassword } = getValues();

    try {
      if (!password.trim()) {
        throw new Error('密碼是必填項！');
      }

      if (password.length < 6) {
        throw new Error('密碼長度至少為 6 個字元！');
      }

      if (!confirmPassword.trim()) {
        throw new Error('確認密碼是必填項！');
      }

      if (password !== confirmPassword) {
        throw new Error('密碼不一致！');
      }

      return true;
    } catch (error) {
      if (error instanceof Error) {
        await openInfoDialog('系統消息', error.message);
      }
      return false;
    }
  };

  const onSubmit = async (values: any) => {
    const isValid = await validateForm();
    if (!isValid) return;

    try {
      setLoading(true);
      const { success, message } = await resetPassword(
        token || '',
        values.password
      );
      setLoading(false);

      if (success) {
        await openInfoDialog('系統消息', '密碼已成功重置。');
        navigate('/login');
      } else {
        await openInfoDialog(
          '系統消息',
          message || '無法重置密碼，請稍後再試。'
        );
      }
    } catch (error) {
      setLoading(false);
      console.error('密碼重置失敗:', error);
      await openInfoDialog('系統消息', '系統問題，請稍後再嘗試。');
    }
  };

  return (
    <div className="restPwdForm">
      <MCard customClass="mcard--restPwdForm" title="重置密碼">
        <div className="restPwdForm__container">
          <div className="restPwdForm__main">
            <form
              className="restPwdForm__form"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="restPwdForm__form-inputs">
                <p className="restPwdForm__text">密碼</p>
                <input
                  className={`restPwdForm__form-input ${
                    errors.password ? 'input-error' : ''
                  }`}
                  type="password"
                  {...register('password')}
                  placeholder="請輸入密碼"
                />
                {errors.password && (
                  <p className="error-text">{errors.password.message}</p>
                )}
              </div>

              <div className="restPwdForm__form-inputs">
                <p className="restPwdForm__text">確認密碼</p>
                <input
                  className={`restPwdForm__form-input ${
                    errors.confirmPassword ? 'input-error' : ''
                  }`}
                  type="password"
                  {...register('confirmPassword')}
                  placeholder="請輸入密碼"
                />
                {errors.confirmPassword && (
                  <p className="error-text">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="restPwdForm__btns m-t-12">
                <button
                  type="submit"
                  className="restPwdForm__btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '登入中...' : '登入'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </MCard>
    </div>
  );
};

export default RestPwdForm;
