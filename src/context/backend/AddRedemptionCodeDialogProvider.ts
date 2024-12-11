import { useState } from 'react';

export const useAddRedemptionCodeDialog = () => {
  const [addRedemptionCodeDialogOpen, setAddRedemptionCodeDialogOpen] =
    useState(false);
  const [customClass, setCustomClass] = useState<string | undefined>('');
  const [addShipmentResolve, setAddShipmentResolve] = useState<
    ((value: boolean) => void) | null
  >(null);

  const openAddRedemptionCodeDialog = (
    customClass?: string
  ): Promise<boolean> => {
    setCustomClass(customClass);
    setAddRedemptionCodeDialogOpen(true);

    return new Promise((resolve) => {
      setAddShipmentResolve(() => resolve);
    });
  };

  const closeAddRedemptionCodeDialog = (result: boolean) => {
    setAddRedemptionCodeDialogOpen(false);
    if (addShipmentResolve) addShipmentResolve(result);
  };

  const confirmAddRedemptionCodeDialog = () => {
    setAddRedemptionCodeDialogOpen(false);
    if (addShipmentResolve) addShipmentResolve(true);
  };

  return {
    addRedemptionCodeDialogOpen,
    customClass,
    openAddRedemptionCodeDialog,
    closeAddRedemptionCodeDialog,
    confirmAddRedemptionCodeDialog,
  };
};
