import { useState } from 'react';

export const useDrawDialog = () => {
  const [drawData, setDrawData] = useState<any>(null);
  const [drawDialogOpen, setDrawDialogOpen] = useState(false);
  const [customClass, setCustomClass] = useState<string | undefined>('');
  const [confirmResolve, setConfirmResolve] = useState<
    ((value: boolean) => void) | null
  >(null);

  const openDrawDialog = (
    drawData: any,
    customClass?: string
  ): Promise<boolean> => {
    setCustomClass(customClass);
    setDrawData(drawData);
    setDrawDialogOpen(true);

    return new Promise((resolve) => {
      setConfirmResolve(() => resolve);
    });
  };

  const closeDrawDialog = () => {
    setCustomClass('');
    setDrawData(null);
    setDrawDialogOpen(false);
    if (confirmResolve) confirmResolve(false);
  };

  const confirmDrawDialog = () => {
    setCustomClass('');
    setDrawData(null);
    setDrawDialogOpen(false);
    if (confirmResolve) confirmResolve(true);
  };

  return {
    drawData,
    drawDialogOpen,
    customClass,
    openDrawDialog,
    closeDrawDialog,
    confirmDrawDialog,
  };
};
