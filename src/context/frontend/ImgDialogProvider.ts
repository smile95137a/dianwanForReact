import { useState } from 'react';

export const useImgDialog = () => {
  const [imgUrl, setImgUrl] = useState<any>(null);
  const [imgDialogOpen, setImgDialogOpen] = useState(false);
  const [customClass, setCustomClass] = useState<string | undefined>('');
  const [confirmResolve, setConfirmResolve] = useState<
    ((value: boolean) => void) | null
  >(null);

  const openImgDialog = (
    drawData: any,
    customClass?: string
  ): Promise<boolean> => {
    setCustomClass(customClass);
    setImgUrl(drawData);
    setImgDialogOpen(true);

    return new Promise((resolve) => {
      setConfirmResolve(() => resolve);
    });
  };

  const closeImgDialog = () => {
    setCustomClass('');
    setImgUrl(null);
    setImgDialogOpen(false);
    if (confirmResolve) confirmResolve(false);
  };

  const confirmImgDialog = () => {
    setCustomClass('');
    setImgUrl(null);
    setImgDialogOpen(false);
    if (confirmResolve) confirmResolve(true);
  };

  return {
    imgUrl,
    imgDialogOpen,
    customClass,
    openImgDialog,
    closeImgDialog,
    confirmImgDialog,
  };
};
