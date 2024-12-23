import { useState } from 'react';

export const useAnimateDialog = () => {
  const [drawData, setDrawData] = useState<any>(null);
  const [animateDialogOpen, setAnimateDialogOpen] = useState(false);
  const [customClass, setCustomClass] = useState<string | undefined>('');
  const [confirmResolve, setConfirmResolve] = useState<
    ((value: boolean) => void) | null
  >(null);

  const openAnimateDialog = (
    drawData: any,
    customClass?: string
  ): Promise<boolean> => {
    setCustomClass(customClass);
    setDrawData(drawData);
    setAnimateDialogOpen(true);

    return new Promise((resolve) => {
      setConfirmResolve(() => resolve);
    });
  };

  const closeAnimateDialog = () => {
    setCustomClass('');
    setDrawData(null);
    setAnimateDialogOpen(false);
    if (confirmResolve) confirmResolve(false);
  };

  const confirmAnimateDialog = () => {
    setCustomClass('');
    setDrawData(null);
    setAnimateDialogOpen(false);
    if (confirmResolve) confirmResolve(true);
  };

  return {
    drawData,
    animateDialogOpen,
    customClass,
    openAnimateDialog,
    closeAnimateDialog,
    confirmAnimateDialog,
  };
};
