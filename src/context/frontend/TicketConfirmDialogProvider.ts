import { useState } from 'react';

export const useTicketConfirmDialog = () => {
  const [payType, setPayType] = useState<any>(null);
  const [productData, setProductData] = useState<any>(null);
  const [ticketList, setTicketList] = useState<any[]>([]);
  const [ticketConfirmDialogOpen, setTicketConfirmDialogOpen] = useState(false);
  const [isCustmerPrize, setIsCustmerPrize] = useState<boolean>(false);
  const [inputCode, setInputCode] = useState<string>('');
  const [confirmResolve, setConfirmResolve] = useState<
    ((value: boolean) => void) | null
  >(null);

  const openTicketConfirmDialog = (
    isCustmerPrize: boolean,
    inputCode: string,
    payType: any,
    productData: any,
    ticketList: any[]
  ): Promise<boolean> => {
    setIsCustmerPrize(isCustmerPrize);
    setInputCode(inputCode);
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
    setIsCustmerPrize(false);
    setInputCode('');
    setPayType(null);
    setProductData(null);
    setTicketList([]);
    if (confirmResolve) confirmResolve(false);
  };

  const ticketConfirmDialog = (data: any) => {
    setTicketConfirmDialogOpen(false);
    setIsCustmerPrize(false);
    setInputCode('');
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
    isCustmerPrize,
    inputCode,
    openTicketConfirmDialog,
    closeTicketConfirmDialog,
    ticketConfirmDialog,
  };
};
