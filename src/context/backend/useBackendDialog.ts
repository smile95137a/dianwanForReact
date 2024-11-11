import { useContext } from 'react';
import {
  BackendDialogContext,
  DialogContextType,
} from './BackendDialogContext';

export const useBackendDialog = (): DialogContextType => {
  const context = useContext(BackendDialogContext);
  if (!context) {
    throw new Error('useBackendDialog 必須在 DialogProvider 中使用');
  }
  return context;
};
