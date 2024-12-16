import { useState } from 'react';

export const useOrderShipmentDialog = () => {
  const [order, setOrder] = useState<any>(null);
  const [orderShipmentDialogOpen, setOrderShipmentDialogOpen] = useState(false);
  const [orderDetailsResolve, setOrderDetailsResolve] = useState<
    ((value: boolean) => void) | null
  >(null);

  const openOrderShipmentDialog = (orderDetails: any): Promise<boolean> => {
    setOrder(orderDetails);
    setOrderShipmentDialogOpen(true);

    return new Promise((resolve) => {
      setOrderDetailsResolve(() => resolve);
    });
  };

  const closeOrderShipmentDialog = (result: boolean) => {
    setOrder(null);
    setOrderShipmentDialogOpen(false);
    if (orderDetailsResolve) orderDetailsResolve(result);
  };

  const confirmOrderShipmentDialog = () => {
    setOrderShipmentDialogOpen(false);
    if (orderDetailsResolve) orderDetailsResolve(true);
  };

  return {
    order,
    orderShipmentDialogOpen,
    openOrderShipmentDialog,
    closeOrderShipmentDialog,
    confirmOrderShipmentDialog,
  };
};
