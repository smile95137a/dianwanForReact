import { useState } from 'react';

export const useDrawProductDialog = () => {
  const [drawData, setDrawData] = useState<any>(null);
  const [drawProductDialogOpen, setDrawProductDialogOpen] = useState(false);
  const [customClass, setCustomClass] = useState<string | undefined>('');
  const [confirmResolve, setConfirmResolve] = useState<
    ((value: boolean) => void) | null
  >(null);

  const openDrawProductDialog = (
    drawData: any,
    customClass?: string
  ): Promise<boolean> => {
    setCustomClass(customClass);
    setDrawData(drawData);
    setDrawProductDialogOpen(true);

    return new Promise((resolve) => {
      setConfirmResolve(() => resolve);
    });
  };

  const closeDrawProductDialog = () => {
    setCustomClass('');
    setDrawData(null);
    setDrawProductDialogOpen(false);
    if (confirmResolve) confirmResolve(false);
  };

  const confirmDrawProductDialog = () => {
    setCustomClass('');
    setDrawData(null);
    setDrawProductDialogOpen(false);
    if (confirmResolve) confirmResolve(true);
  };

  return {
    drawData,
    drawProductDialogOpen,
    customClass,
    openDrawProductDialog,
    closeDrawProductDialog,
    confirmDrawProductDialog,
  };
};
