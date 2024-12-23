import React, { FC } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Dialog from './Dialog';
import logoImg from '@/assets/image/logo.png';
import { useLoading } from '@/context/frontend/LoadingContext';
import { generateResetPasswordLink } from '@/services/frontend/passwordResetService';
import { useFrontendDialog } from '@/context/frontend/useFrontedDialog';

interface RestPwdDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { email: string }) => void;
  customClass?: string;
}

const schema = yup.object({
  username: yup.string().required('信箱為必填項').email('請輸入有效的信箱地址'),
});

const RestPwdDialog: FC<RestPwdDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  customClass,
}) => {
  const { setLoading } = useLoading();
  const { openInfoDialog } = useFrontendDialog();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<{ username: string }>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (values: any) => {
    try {
      setLoading(true);
      const { success, message } = await generateResetPasswordLink(
        values.username
      );
      setLoading(false);
      if (success) {
        await openInfoDialog(
          '系統消息',
          '密碼重置連結已發送至您的信箱，請檢查收件匣。'
        );
      } else {
        await openInfoDialog('系統消息', message);
      }
    } catch (error) {
      setLoading(false);
      await openInfoDialog('系統消息', '系統問題，請稍後再嘗試。');
      console.error('失敗:', error);
    }
  };
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      className={`dialog--restPwd ${customClass || ''}`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="restPwdDialog">
        <div className="restPwdDialog__header">
          <div className="restPwdDialog__logo">
            <img src={logoImg} className="restPwdDialog__logo-img" alt="Logo" />
          </div>
        </div>
        <div className="restPwdDialog__title">
          <p className="restPwdDialog__text">忘記密碼</p>
        </div>
        <div className="restPwdDialog__main">
          <div className="flex flex-column">
            <div className="flex">
              <div className="w-100">
                <p className="restPwdDialog__text">信箱:</p>
              </div>
              <input
                className={`restPwdDialog__input ${
                  errors.username ? 'input-error' : ''
                }`}
                {...register('username')}
                placeholder="請輸入您的信箱"
              />
            </div>
            {errors.username && (
              <p className="text-right error-text">{errors.username.message}</p>
            )}
          </div>
        </div>
        <div className="restPwdDialog__footer">
          <div className="restPwdDialog__footer-btns">
            <div
              className="restPwdDialog__footer-btn restPwdDialog__footer-btn--cancel"
              onClick={onClose}
            >
              取消
            </div>
            <button
              type="submit"
              className="restPwdDialog__footer-btn restPwdDialog__footer-btn--confirm"
            >
              確認
            </button>
          </div>
        </div>
      </form>
    </Dialog>
  );
};

export default RestPwdDialog;
