import RestPwdForm from '@/components/frontend/RestPwdForm';
import { useFrontendDialog } from '@/context/frontend/useFrontedDialog';
import { verifyPasswordToken } from '@/services/frontend/passwordResetService';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
interface ErrMsg {
  title: string;
  message: string;
}
const errCodeMap: Record<string, ErrMsg> = {
  9001: {
    title: '失效的連結',
    message: '連結已被使用，請您再確認。',
  },
  9002: {
    title: '失效的連結',
    message: '連結已過期，請您再確認。',
  },
  9003: {
    title: '無效的連結',
    message: '無效的連結，請您再確認。',
  },
  9004: {
    title: '無效的連結',
    message: '不存在此連結，請您再確認。',
  },
};

const RestPwd = () => {
  const { token } = useParams<{ token: string }>();
  const { openInfoDialog } = useFrontendDialog();

  const [isActiveUrl, setIsActiveUrl] = useState(false);
  const [errMsgObj, setErrMsgObj] = useState<any>({
    title: '',
    message: '',
  });

  const verifyToken = async () => {
    try {
      const { success, message } = await verifyPasswordToken(token || '');
      if (success) {
        setIsActiveUrl(true);
      } else {
        setIsActiveUrl(false);
        await openInfoDialog('系統消息', message || '未知的錯誤，請稍後再試。');
      }
    } catch (error: any) {
      console.error('Error during token verification:', error);
      const code = (error.data?.code as keyof typeof errCodeMap) || '9004';
      setIsActiveUrl(false);
      const errorMsg = errCodeMap[code];
      setErrMsgObj(errorMsg);
      console.log('Error message set to:', errorMsg);
      await openInfoDialog('系統消息', errorMsg.message);
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  return (
    <div>
      {isActiveUrl ? (
        <RestPwdForm />
      ) : (
        <div>
          <h2>{errMsgObj.title}</h2>
          <p>{errMsgObj.message}</p>
        </div>
      )}
    </div>
  );
};

export default RestPwd;
