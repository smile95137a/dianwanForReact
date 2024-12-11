import { useState } from 'react';

export const useAddShipmentDialog = () => {
  const [addShipmentDialogOpen, setAddShipmentDialogOpen] = useState(false);
  const [customClass, setCustomClass] = useState<string | undefined>('');
  const [addShipmentResolve, setAddShipmentResolve] = useState<
    ((value: boolean) => void) | null
  >(null);

  const openAddShipmentDialog = (customClass?: string): Promise<boolean> => {
    setCustomClass(customClass);
    setAddShipmentDialogOpen(true);

    return new Promise((resolve) => {
      setAddShipmentResolve(() => resolve);
    });
  };

  const closeAddShipmentDialog = (result: boolean) => {
    setAddShipmentDialogOpen(false);
    if (addShipmentResolve) addShipmentResolve(result);
  };

  const confirmAddShipmentDialog = () => {
    setAddShipmentDialogOpen(false);
    if (addShipmentResolve) addShipmentResolve(true);
  };

  return {
    addShipmentDialogOpen,
    customClass,
    openAddShipmentDialog,
    closeAddShipmentDialog,
    confirmAddShipmentDialog,
  };
};
