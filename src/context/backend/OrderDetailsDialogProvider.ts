import { useState } from 'react';

export const useOrderDetailsDialog = () => {
  const [order, setOrder] = useState<any>(null);
  const [orderDetailsDialogOpen, setOrderDetailsDialogOpen] = useState(false);
  const [orderDetailsResolve, setOrderDetailsResolve] = useState<
    ((value: boolean) => void) | null
  >(null);

  const openOrderDetailsDialog = (orderDetails: any): Promise<boolean> => {
    setOrder(orderDetails);
    setOrderDetailsDialogOpen(true);

    return new Promise((resolve) => {
      setOrderDetailsResolve(() => resolve);
    });
  };

  const closeOrderDetailsDialog = (result: boolean) => {
    setOrder(null);
    setOrderDetailsDialogOpen(false);
    if (orderDetailsResolve) orderDetailsResolve(result);
  };

  const confirmOrderDetailsDialog = () => {
    setOrderDetailsDialogOpen(false);
    if (orderDetailsResolve) orderDetailsResolve(true);
  };

  return {
    order,
    orderDetailsDialogOpen,
    openOrderDetailsDialog,
    closeOrderDetailsDialog,
    confirmOrderDetailsDialog,
  };
};
