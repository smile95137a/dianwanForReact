import { useState } from 'react';

export const useDrawStepDialog = () => {
  const [drawData, setDrawData] = useState<any>(null);
  const [drawStepDialogOpen, setDrawStepDialogOpen] = useState(false);
  const [customClass, setCustomClass] = useState<string | undefined>('');
  const [confirmResolve, setConfirmResolve] = useState<
    ((value: boolean) => void) | null
  >(null);

  const openDrawStepDialog = (
    drawData: any,
    customClass?: string
  ): Promise<boolean> => {
    setCustomClass(customClass);
    setDrawData(drawData);
    setDrawStepDialogOpen(true);

    return new Promise((resolve) => {
      setConfirmResolve(() => resolve);
    });
  };

  const closeDrawStepDialog = () => {
    setCustomClass('');
    setDrawData(null);
    setDrawStepDialogOpen(false);
    if (confirmResolve) confirmResolve(false);
  };

  const confirmDrawStepDialog = () => {
    setCustomClass('');
    setDrawData(null);
    setDrawStepDialogOpen(false);
    if (confirmResolve) confirmResolve(true);
  };

  return {
    drawData,
    drawStepDialogOpen,
    customClass,
    openDrawStepDialog,
    closeDrawStepDialog,
    confirmDrawStepDialog,
  };
};
