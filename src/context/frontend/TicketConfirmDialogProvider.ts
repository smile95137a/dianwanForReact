import { useState } from 'react';

export const useTicketConfirmDialog = () => {
  const [payType, setPayType] = useState<any>(null);
  const [productData, setProductData] = useState<any>(null);
  const [ticketList, setTicketList] = useState<any[]>([]);
  const [ticketConfirmDialogOpen, setTicketConfirmDialogOpen] = useState(false);
  const [confirmResolve, setConfirmResolve] = useState<
    ((value: boolean) => void) | null
  >(null);

  const openTicketConfirmDialog = (
    payType: any,
    productData: any,
    ticketList: any[]
  ): Promise<boolean> => {
    setPayType(payType);
    setProductData(productData);
    setTicketList(ticketList);
    setTicketConfirmDialogOpen(true);

    return new Promise((resolve) => {
      setConfirmResolve(() => resolve);
    });
  };

  const closeTicketConfirmDialog = () => {
    setTicketConfirmDialogOpen(false);
    setPayType(null);
    setProductData(null);
    setTicketList([]);
    if (confirmResolve) confirmResolve(false);
  };

  const ticketConfirmDialog = (data: any) => {
    setTicketConfirmDialogOpen(false);
    setPayType(null);
    setProductData(null);
    setTicketList([]);
    if (confirmResolve) confirmResolve(data);
  };

  return {
    payType,
    productData,
    ticketList,
    ticketConfirmDialogOpen,
    openTicketConfirmDialog,
    closeTicketConfirmDialog,
    ticketConfirmDialog,
  };
};
