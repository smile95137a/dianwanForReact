import { useState } from 'react';

export const useInfoDialog = () => {
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [infoTitle, setInfoTitle] = useState<string>('');
  const [infoContent, setInfoContent] = useState<string>('');
  const [customClass, setCustomClass] = useState<string | undefined>('');
  const [infoResolve, setInfoResolve] = useState<(() => void) | null>(null);

  const openInfoDialog = (
    title: string,
    content: string,
    customClass?: string
  ): Promise<void> => {
    setInfoTitle(title);
    setInfoContent(content);
    setCustomClass(customClass);
    setInfoDialogOpen(true);

    return new Promise((resolve) => {
      setInfoResolve(() => resolve);
    });
  };

  const closeInfoDialog = () => {
    setInfoDialogOpen(false);
    if (infoResolve) infoResolve();
  };

  return {
    infoDialogOpen,
    infoTitle,
    infoContent,
    customClass,
    openInfoDialog,
    closeInfoDialog,
  };
};
