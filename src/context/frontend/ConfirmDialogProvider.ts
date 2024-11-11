import { useState } from 'react';

export const useConfirmDialog = () => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [customClass, setCustomClass] = useState<string | undefined>('');
  const [confirmResolve, setConfirmResolve] = useState<
    ((value: boolean) => void) | null
  >(null);

  const openConfirmDialog = (customClass?: string): Promise<boolean> => {
    setCustomClass(customClass);
    setConfirmDialogOpen(true);

    return new Promise((resolve) => {
      setConfirmResolve(() => resolve);
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialogOpen(false);
    if (confirmResolve) confirmResolve(false);
  };

  const confirmDialog = () => {
    setConfirmDialogOpen(false);
    if (confirmResolve) confirmResolve(true);
  };

  return {
    confirmDialogOpen,
    customClass,
    openConfirmDialog,
    closeConfirmDialog,
    confirmDialog,
  };
};
