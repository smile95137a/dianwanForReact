import { useState } from 'react';

export const useAddShipmentDialog = () => {
  const [shipment, setShipment] = useState<any>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [addShipmentDialogOpen, setAddShipmentDialogOpen] = useState(false);
  const [customClass, setCustomClass] = useState<string | undefined>('');
  const [addShipmentResolve, setAddShipmentResolve] = useState<
    ((value: boolean) => void) | null
  >(null);

  const openAddShipmentDialog = (
    isEdit = false,
    shipment = null,
    customClass?: string
  ): Promise<boolean> => {
    setIsEdit(isEdit);
    setShipment(shipment);
    setCustomClass(customClass);
    setAddShipmentDialogOpen(true);

    return new Promise((resolve) => {
      setAddShipmentResolve(() => resolve);
    });
  };

  const closeAddShipmentDialog = (result: boolean) => {
    setAddShipmentDialogOpen(false);
    setIsEdit(false);
    setShipment(false);
    if (addShipmentResolve) addShipmentResolve(result);
  };

  const confirmAddShipmentDialog = () => {
    setAddShipmentDialogOpen(false);
    if (addShipmentResolve) addShipmentResolve(true);
  };

  return {
    isEdit,
    shipment,
    addShipmentDialogOpen,
    customClass,
    openAddShipmentDialog,
    closeAddShipmentDialog,
    confirmAddShipmentDialog,
  };
};
