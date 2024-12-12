import { useState } from 'react';

export const useAddNewsDialog = () => {
  const [news, setNews] = useState<any>(null);
  const [isNewsEdit, setIsNewsEdit] = useState(false);
  const [addNewsDialogOpen, setAddNewsDialogOpen] = useState(false);
  const [addNewsResolve, setAddNewsResolve] = useState<
    ((value: boolean) => void) | null
  >(null);

  const openAddNewsDialog = (isEdit = false, news = null): Promise<boolean> => {
    setIsNewsEdit(isEdit);
    setNews(news);
    setAddNewsDialogOpen(true);

    return new Promise((resolve) => {
      setAddNewsResolve(() => resolve);
    });
  };

  const closeAddNewsDialog = (result: boolean) => {
    setIsNewsEdit(false);
    setNews(null);
    setAddNewsDialogOpen(false);
    if (addNewsResolve) addNewsResolve(result);
  };

  const confirmAddNewsDialog = () => {
    setAddNewsDialogOpen(false);
    if (addNewsResolve) addNewsResolve(true);
  };

  return {
    news,
    isNewsEdit,
    addNewsDialogOpen,
    openAddNewsDialog,
    closeAddNewsDialog,
    confirmAddNewsDialog,
  };
};
