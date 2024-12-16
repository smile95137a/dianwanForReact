import { useState } from 'react';

export const useAddProductCategoryDialog = () => {
  const [productCategory, setProductCategory] = useState<any>(null);
  const [isProductCategoryEdit, setIsProductCategoryEdit] = useState(false);
  const [addProductCategoryDialogOpen, setAddProductCategoryDialogOpen] =
    useState(false);
  const [addProductCategoryResolve, setAddProductCategoryResolve] = useState<
    ((value: boolean) => void) | null
  >(null);

  const openAddProductCategoryDialog = (
    isEdit = false,
    member = null
  ): Promise<boolean> => {
    setIsProductCategoryEdit(isEdit);
    setProductCategory(member);
    setAddProductCategoryDialogOpen(true);

    return new Promise((resolve) => {
      setAddProductCategoryResolve(() => resolve);
    });
  };

  const closeAddProductCategoryDialog = (result: boolean) => {
    setIsProductCategoryEdit(false);
    setProductCategory(null);
    setAddProductCategoryDialogOpen(false);
    if (addProductCategoryResolve) addProductCategoryResolve(result);
  };

  const confirmAddProductCategoryDialog = () => {
    setAddProductCategoryDialogOpen(false);
    if (addProductCategoryResolve) addProductCategoryResolve(true);
  };

  return {
    productCategory,
    isProductCategoryEdit,
    addProductCategoryDialogOpen,
    openAddProductCategoryDialog,
    closeAddProductCategoryDialog,
    confirmAddProductCategoryDialog,
  };
};
