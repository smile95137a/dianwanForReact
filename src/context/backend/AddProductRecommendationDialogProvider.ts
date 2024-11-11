import { useState } from 'react';

export const useAddProductRecommendationDialog = () => {
  const [
    addProductRecommendationDialogOpen,
    setAddProductRecommendationDialogOpen,
  ] = useState(false);
  const [customClass, setCustomClass] = useState<string | undefined>('');
  const [addBannerResolve, setAddBannerResolve] = useState<
    ((value: boolean) => void) | null
  >(null);

  const openAddProductRecommendationDialog = (
    customClass?: string
  ): Promise<boolean> => {
    setCustomClass(customClass);
    setAddProductRecommendationDialogOpen(true);

    return new Promise((resolve) => {
      setAddBannerResolve(() => resolve);
    });
  };

  const closeAddProductRecommendationDialog = (result: boolean) => {
    setAddProductRecommendationDialogOpen(false);
    if (addBannerResolve) addBannerResolve(result);
  };

  const confirmAddProductRecommendationDialog = () => {
    setAddProductRecommendationDialogOpen(false);
    if (addBannerResolve) addBannerResolve(true);
  };

  return {
    addProductRecommendationDialogOpen,
    customClass,
    openAddProductRecommendationDialog,
    closeAddProductRecommendationDialog,
    confirmAddProductRecommendationDialog,
  };
};
