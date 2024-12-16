import { useState } from 'react';

export const useAddProductDialog = () => {
  const [product, setProduct] = useState<any>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [addProductDialogOpen, setAddProductDialogOpen] = useState(false);
  const [addProductResolve, setAddProductResolve] = useState<
    ((value: boolean) => void) | null
  >(null);

  const openAddProductDialog = (
    isEdit = false,
    product = null
  ): Promise<boolean> => {
    setIsEdit(isEdit);
    setProduct(product);
    setAddProductDialogOpen(true);

    return new Promise((resolve) => {
      setAddProductResolve(() => resolve);
    });
  };

  const closeAddProductDialog = (result: boolean) => {
    setIsEdit(false);
    setProduct(null);
    setAddProductDialogOpen(false);
    if (addProductResolve) addProductResolve(result);
  };

  const confirmAddProductDialog = () => {
    setAddProductDialogOpen(false);
    if (addProductResolve) addProductResolve(true);
  };

  return {
    product,
    isEdit,
    addProductDialogOpen,
    openAddProductDialog,
    closeAddProductDialog,
    confirmAddProductDialog,
  };
};
