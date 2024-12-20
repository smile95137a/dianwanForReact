import { useState } from 'react';

export const useProductDetailDialog = () => {
  const [product, setProduct] = useState<any>(null);
  const [productDetailDialogOpen, setProductDetailDialogOpen] = useState(false);
  const [customClass, setCustomClass] = useState<string | undefined>('');
  const [productDetailResolve, setProductDetailResolve] = useState<
    ((value: boolean) => void) | null
  >(null);

  const openProductDetailDialog = (
    p: any,
    customClass?: string
  ): Promise<boolean> => {
    setCustomClass(customClass);
    setProductDetailDialogOpen(true);
    setProduct(p);
    return new Promise((resolve) => {
      setProductDetailResolve(() => resolve);
    });
  };

  const closeProductDetailDialog = (result: boolean) => {
    setProductDetailDialogOpen(false);
    setProduct(null);
    if (productDetailResolve) productDetailResolve(result);
  };

  const confirmProductDetailDialog = () => {
    setProductDetailDialogOpen(false);
    setProduct(null);
    if (productDetailResolve) productDetailResolve(true);
  };

  return {
    product,
    productDetailDialogOpen,
    customClass,
    openProductDetailDialog,
    closeProductDetailDialog,
    confirmProductDetailDialog,
  };
};
