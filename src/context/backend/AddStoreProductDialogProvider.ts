import { useState } from 'react';

export const useAddStoreProductDialog = () => {
  const [storeProduct, setStoreProduct] = useState<any>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [addStoreProductDialogOpen, setAddStoreProductDialogOpen] =
    useState(false);
  const [addStoreProductResolve, setAddStoreProductResolve] = useState<
    ((value: boolean) => void) | null
  >(null);

  const openAddStoreProductDialog = (
    isEdit = false,
    member = null
  ): Promise<boolean> => {
    setIsEdit(isEdit);
    setStoreProduct(member);
    setAddStoreProductDialogOpen(true);

    return new Promise((resolve) => {
      setAddStoreProductResolve(() => resolve);
    });
  };

  const closeAddStoreProductDialog = (result: boolean) => {
    setIsEdit(false);
    setStoreProduct(null);
    setAddStoreProductDialogOpen(false);
    if (addStoreProductResolve) addStoreProductResolve(result);
  };

  const confirmAddStoreProductDialog = () => {
    setAddStoreProductDialogOpen(false);
    if (addStoreProductResolve) addStoreProductResolve(true);
  };

  return {
    storeProduct,
    isEdit,
    addStoreProductDialogOpen,
    openAddStoreProductDialog,
    closeAddStoreProductDialog,
    confirmAddStoreProductDialog,
  };
};
