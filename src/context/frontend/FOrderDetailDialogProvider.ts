import { useState } from 'react';

export const useFOrderDetailDialog = () => {
  const [orderData, setOrderData] = useState<any>(null);
  const [fOrderDetailDialogOpen, setFOrderDetailDialogOpen] = useState(false);
  const [confirmResolve, setConfirmResolve] = useState<
    ((value: boolean) => void) | null
  >(null);

  const openFOrderDetailDialog = (orderData: any): Promise<boolean> => {
    setOrderData(orderData);
    setFOrderDetailDialogOpen(true);

    return new Promise((resolve) => {
      setConfirmResolve(() => resolve);
    });
  };

  const closeFOrderDetailDialog = () => {
    setOrderData(null);
    setFOrderDetailDialogOpen(false);
    if (confirmResolve) confirmResolve(false);
  };

  const confirmFOrderDetailDialog = () => {
    setOrderData(null);
    setFOrderDetailDialogOpen(false);
    if (confirmResolve) confirmResolve(true);
  };

  return {
    orderData,
    fOrderDetailDialogOpen,
    openFOrderDetailDialog,
    closeFOrderDetailDialog,
    confirmFOrderDetailDialog,
  };
};
