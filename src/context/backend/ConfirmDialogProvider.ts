import { useState } from 'react';

export const useConfirmDialog = () => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState<string>('');
  const [confirmContent, setConfirmContent] = useState<string>('');
  const [customClass, setCustomClass] = useState<string | undefined>('');
  const [confirmResolve, setConfirmResolve] = useState<
    ((value: boolean) => void) | null
  >(null);

  const openConfirmDialog = (
    title: string,
    content: string,
    customClass?: string
  ): Promise<boolean> => {
    setConfirmTitle(title);
    setConfirmContent(content);
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
    confirmTitle,
    confirmContent,
    customClass,
    openConfirmDialog,
    closeConfirmDialog,
    confirmDialog,
  };
};
