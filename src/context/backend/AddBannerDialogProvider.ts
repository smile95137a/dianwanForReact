import { useState } from 'react';

export const useAddBannerDialog = () => {
  const [addBannerDialogOpen, setAddBannerDialogOpen] = useState(false);
  const [customClass, setCustomClass] = useState<string | undefined>('');
  const [addBannerResolve, setAddBannerResolve] = useState<
    ((value: boolean) => void) | null
  >(null);

  const openAddBannerDialog = (customClass?: string): Promise<boolean> => {
    setCustomClass(customClass);
    setAddBannerDialogOpen(true);

    return new Promise((resolve) => {
      setAddBannerResolve(() => resolve);
    });
  };

  const closeAddBannerDialog = (result: boolean) => {
    setAddBannerDialogOpen(false);
    if (addBannerResolve) addBannerResolve(result);
  };

  const confirmAddBannerDialog = () => {
    setAddBannerDialogOpen(false);
    if (addBannerResolve) addBannerResolve(true);
  };

  return {
    addBannerDialogOpen,
    customClass,
    openAddBannerDialog,
    closeAddBannerDialog,
    confirmAddBannerDialog,
  };
};
