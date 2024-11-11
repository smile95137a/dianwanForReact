import { useContext } from 'react';
import { DialogContextType, FrontDialogContext } from './FrontendDialogContext';
export const useFrontendDialog = (): DialogContextType => {
  const context = useContext(FrontDialogContext);
  if (!context) {
    throw new Error('useFrontendDialog 必須在 DialogProvider 中使用');
  }
  return context;
};
