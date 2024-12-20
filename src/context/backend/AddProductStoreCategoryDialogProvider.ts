import { useState } from 'react';

export const useAddProductStoreCategoryDialog = () => {
  const [productStoreCategory, setProductStoreCategory] = useState<any>(null);
  const [isProductStoreCategoryEdit, setIsProductStoreCategoryEdit] =
    useState(false);
  const [
    addProductStoreCategoryDialogOpen,
    setAddProductStoreCategoryDialogOpen,
  ] = useState(false);
  const [addProductStoreCategoryResolve, setAddProductStoreCategoryResolve] =
    useState<((value: boolean) => void) | null>(null);

  const openAddProductStoreCategoryDialog = (
    isEdit = false,
    member = null
  ): Promise<boolean> => {
    setIsProductStoreCategoryEdit(isEdit);
    setProductStoreCategory(member);
    setAddProductStoreCategoryDialogOpen(true);

    return new Promise((resolve) => {
      setAddProductStoreCategoryResolve(() => resolve);
    });
  };

  const closeAddProductStoreCategoryDialog = (result: boolean) => {
    setIsProductStoreCategoryEdit(false);
    setProductStoreCategory(null);
    setAddProductStoreCategoryDialogOpen(false);
    if (addProductStoreCategoryResolve) addProductStoreCategoryResolve(result);
  };

  const confirmAddProductStoreCategoryDialog = () => {
    setAddProductStoreCategoryDialogOpen(false);
    if (addProductStoreCategoryResolve) addProductStoreCategoryResolve(true);
  };

  return {
    productStoreCategory,
    isProductStoreCategoryEdit,
    addProductStoreCategoryDialogOpen,
    openAddProductStoreCategoryDialog,
    closeAddProductStoreCategoryDialog,
    confirmAddProductStoreCategoryDialog,
  };
};
