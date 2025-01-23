import { useState } from 'react';

export const useCreateShippingOrderDialog = () => {
  const [order, setOrder] = useState<any>(null);
  const [createShippingOrderDialogOpen, setCreateShippingOrderDialogOpen] =
    useState(false);
  const [createShippingOrderResolve, setCreateShippingOrderResolve] = useState<
    ((value: boolean) => void) | null
  >(null);

  const openCreateShippingOrderDialog = (
    orderDetails: any
  ): Promise<boolean> => {
    setOrder(orderDetails);
    setCreateShippingOrderDialogOpen(true);

    return new Promise((resolve) => {
      setCreateShippingOrderResolve(() => resolve);
    });
  };

  const closeCreateShippingOrderDialog = (result: boolean) => {
    setOrder(null);
    setCreateShippingOrderDialogOpen(false);
    if (createShippingOrderResolve) createShippingOrderResolve(result);
  };

  const confirmCreateShippingOrderDialog = () => {
    setOrder(null);
    setCreateShippingOrderDialogOpen(false);
    if (createShippingOrderResolve) createShippingOrderResolve(true);
  };

  return {
    order,
    createShippingOrderDialogOpen,
    openCreateShippingOrderDialog,
    closeCreateShippingOrderDialog,
    confirmCreateShippingOrderDialog,
  };
};
