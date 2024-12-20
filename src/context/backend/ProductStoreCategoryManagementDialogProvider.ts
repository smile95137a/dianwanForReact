import { useState } from 'react';

export const useProductStoreCategoryManagementDialog = () => {
  const [
    productStoreCategoryManagementDialogOpen,
    setProductStoreCategoryManagementDialogOpen,
  ] = useState(false);
  const [customClass, setCustomClass] = useState<string | undefined>('');
  const [
    productStoreCategoryManagementResolve,
    setProductStoreCategoryManagementResolve,
  ] = useState<((value: boolean) => void) | null>(null);

  const openProductStoreCategoryManagementDialog = (
    customClass?: string
  ): Promise<boolean> => {
    setCustomClass(customClass);
    setProductStoreCategoryManagementDialogOpen(true);

    return new Promise((resolve) => {
      setProductStoreCategoryManagementResolve(() => resolve);
    });
  };

  const closeProductStoreCategoryManagementDialog = (result: boolean) => {
    setProductStoreCategoryManagementDialogOpen(false);
    if (productStoreCategoryManagementResolve)
      productStoreCategoryManagementResolve(result);
  };

  const confirmProductStoreCategoryManagementDialog = () => {
    setProductStoreCategoryManagementDialogOpen(false);
    if (productStoreCategoryManagementResolve)
      productStoreCategoryManagementResolve(true);
  };

  return {
    productStoreCategoryManagementDialogOpen,
    customClass,
    openProductStoreCategoryManagementDialog,
    closeProductStoreCategoryManagementDialog,
    confirmProductStoreCategoryManagementDialog,
  };
};
