import { useState } from 'react';

export const useRestPwdDialog = () => {
  const [restPwdDialogOpen, setRestPwdDialogOpen] = useState(false);
  const [customClass, setCustomClass] = useState<string | undefined>('');
  const [confirmResolve, setConfirmResolve] = useState<
    ((value: boolean) => void) | null
  >(null);

  const openRestPwdDialog = (customClass?: string): Promise<boolean> => {
    setCustomClass(customClass);
    setRestPwdDialogOpen(true);

    return new Promise((resolve) => {
      setConfirmResolve(() => resolve);
    });
  };

  const closeRestPwdDialog = () => {
    setCustomClass('');
    setRestPwdDialogOpen(false);
    if (confirmResolve) confirmResolve(false);
  };

  const confirmRestPwdDialog = () => {
    setCustomClass('');
    setRestPwdDialogOpen(false);
    if (confirmResolve) confirmResolve(true);
  };

  return {
    restPwdDialogOpen,
    customClass,
    openRestPwdDialog,
    closeRestPwdDialog,
    confirmRestPwdDialog,
  };
};
