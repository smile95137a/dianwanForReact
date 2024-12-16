import { useState } from 'react';

export const useProductCategoryManagementDialog = () => {
  const [
    productCategoryManagementDialogOpen,
    setProductCategoryManagementDialogOpen,
  ] = useState(false);
  const [customClass, setCustomClass] = useState<string | undefined>('');
  const [
    productCategoryManagementResolve,
    setProductCategoryManagementResolve,
  ] = useState<((value: boolean) => void) | null>(null);

  const openProductCategoryManagementDialog = (
    customClass?: string
  ): Promise<boolean> => {
    setCustomClass(customClass);
    setProductCategoryManagementDialogOpen(true);

    return new Promise((resolve) => {
      setProductCategoryManagementResolve(() => resolve);
    });
  };

  const closeProductCategoryManagementDialog = (result: boolean) => {
    setProductCategoryManagementDialogOpen(false);
    if (productCategoryManagementResolve)
      productCategoryManagementResolve(result);
  };

  const confirmProductCategoryManagementDialog = () => {
    setProductCategoryManagementDialogOpen(false);
    if (productCategoryManagementResolve)
      productCategoryManagementResolve(true);
  };

  return {
    productCategoryManagementDialogOpen,
    customClass,
    openProductCategoryManagementDialog,
    closeProductCategoryManagementDialog,
    confirmProductCategoryManagementDialog,
  };
};
