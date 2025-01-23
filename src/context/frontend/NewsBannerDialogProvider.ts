import { useState } from 'react';

export const useNewsBannerDialog = () => {
  const [newsBannerData, setNewsBannerData] = useState<any>(null);
  const [newsBannerDialogOpen, setNewsBannerDialogOpen] = useState(false);
  const [customClass, setCustomClass] = useState<string | undefined>('');
  const [confirmResolve, setConfirmResolve] = useState<
    ((value: boolean) => void) | null
  >(null);

  const openNewsBannerDialog = (
    newsBannerData: any,
    customClass?: string
  ): Promise<boolean> => {
    setCustomClass(customClass);
    setNewsBannerData(newsBannerData);
    setNewsBannerDialogOpen(true);

    return new Promise((resolve) => {
      setConfirmResolve(() => resolve);
    });
  };

  const closeNewsBannerDialog = () => {
    setCustomClass('');
    setNewsBannerData(null);
    setNewsBannerDialogOpen(false);
    if (confirmResolve) confirmResolve(false);
  };

  const confirmNewsBannerDialog = () => {
    setCustomClass('');
    setNewsBannerData(null);
    setNewsBannerDialogOpen(false);
    if (confirmResolve) confirmResolve(true);
  };

  return {
    newsBannerData,
    newsBannerDialogOpen,
    customClass,
    openNewsBannerDialog,
    closeNewsBannerDialog,
    confirmNewsBannerDialog,
  };
};
