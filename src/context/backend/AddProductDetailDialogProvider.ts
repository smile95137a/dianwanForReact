import { useState } from 'react';

export const useAddProductDetailDialog = () => {
  const [productData, setProductData] = useState<any>(null);
  const [productDetail, setProductDetail] = useState<any>(null);
  const [isProductDetailEdit, setIsProductDetailEdit] = useState(false);
  const [addProductDetailDialogOpen, setAddProductDetailDialogOpen] =
    useState(false);
  const [addProductDetailResolve, setAddProductDetailResolve] = useState<
    ((value: boolean) => void) | null
  >(null);

  const openAddProductDetailDialog = (
    pData: any,
    isEdit = false,
    detail = null
  ): Promise<boolean> => {
    setIsProductDetailEdit(isEdit);
    setProductData(pData);
    setProductDetail(detail);
    setAddProductDetailDialogOpen(true);

    return new Promise((resolve) => {
      setAddProductDetailResolve(() => resolve);
    });
  };

  const closeAddProductDetailDialog = (result: boolean) => {
    setIsProductDetailEdit(false);
    setProductDetail(null);
    setProductData(null);
    setAddProductDetailDialogOpen(false);
    if (addProductDetailResolve) addProductDetailResolve(result);
  };

  const confirmAddProductDetailDialog = () => {
    setAddProductDetailDialogOpen(false);
    setProductDetail(null);
    setProductData(null);
    if (addProductDetailResolve) addProductDetailResolve(true);
  };

  return {
    productData,
    productDetail,
    isProductDetailEdit,
    addProductDetailDialogOpen,
    openAddProductDetailDialog,
    closeAddProductDetailDialog,
    confirmAddProductDetailDialog,
  };
};
