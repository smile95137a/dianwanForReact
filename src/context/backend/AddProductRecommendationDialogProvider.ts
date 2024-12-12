import { useState } from 'react';

export const useAddProductRecommendationDialog = () => {
  const [productRecommendation, setProductRecommendation] = useState<any>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [
    addProductRecommendationDialogOpen,
    setAddProductRecommendationDialogOpen,
  ] = useState(false);
  const [customClass, setCustomClass] = useState<string | undefined>('');
  const [addProductRecommendationResolve, setAddProductRecommendationResolve] =
    useState<((value: boolean) => void) | null>(null);

  const openAddProductRecommendationDialog = (
    isEdit = false,
    productRecommendation = null,
    customClass?: string
  ): Promise<boolean> => {
    setIsEdit(isEdit);
    setProductRecommendation(productRecommendation);
    setCustomClass(customClass);
    setAddProductRecommendationDialogOpen(true);

    return new Promise((resolve) => {
      setAddProductRecommendationResolve(() => resolve);
    });
  };

  const closeAddProductRecommendationDialog = (result: boolean) => {
    setAddProductRecommendationDialogOpen(false);
    setIsEdit(false);
    setProductRecommendation(false);
    if (addProductRecommendationResolve)
      addProductRecommendationResolve(result);
  };

  const confirmAddProductRecommendationDialog = () => {
    setAddProductRecommendationDialogOpen(false);
    if (addProductRecommendationResolve) addProductRecommendationResolve(true);
  };

  return {
    isEdit,
    productRecommendation,
    addProductRecommendationDialogOpen,
    customClass,
    openAddProductRecommendationDialog,
    closeAddProductRecommendationDialog,
    confirmAddProductRecommendationDialog,
  };
};
