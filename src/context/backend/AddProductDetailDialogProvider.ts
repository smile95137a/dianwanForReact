import { useState } from 'react';

export const useAddProductDetailDialog = () => {
  const [productId, setProductId] = useState<any>(null);
  const [productDetail, setProductDetail] = useState<any>(null);
  const [isProductDetailEdit, setIsProductDetailEdit] = useState(false);
  const [addProductDetailDialogOpen, setAddProductDetailDialogOpen] =
    useState(false);
  const [addProductDetailResolve, setAddProductDetailResolve] = useState<
    ((value: boolean) => void) | null
  >(null);

  const openAddProductDetailDialog = (
    pId: any,
    isEdit = false,
    detail = null
  ): Promise<boolean> => {
    setIsProductDetailEdit(isEdit);
    setProductId(pId);
    setProductDetail(detail);
    setAddProductDetailDialogOpen(true);

    return new Promise((resolve) => {
      setAddProductDetailResolve(() => resolve);
    });
  };

  const closeAddProductDetailDialog = (result: boolean) => {
    setIsProductDetailEdit(false);
    setProductDetail(null);
    setProductId(null);
    setAddProductDetailDialogOpen(false);
    if (addProductDetailResolve) addProductDetailResolve(result);
  };

  const confirmAddProductDetailDialog = () => {
    setAddProductDetailDialogOpen(false);
    setProductDetail(null);
    setProductId(null);
    if (addProductDetailResolve) addProductDetailResolve(true);
  };

  return {
    productId,
    productDetail,
    isProductDetailEdit,
    addProductDetailDialogOpen,
    openAddProductDetailDialog,
    closeAddProductDetailDialog,
    confirmAddProductDetailDialog,
  };
};
