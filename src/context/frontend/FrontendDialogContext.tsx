import { createContext } from 'react';

export interface DialogContextType {
  openFOrderDetailDialog: (drawData: any) => Promise<boolean>;
  openDrawDialog: (drawData: any, customClass?: string) => Promise<boolean>;
  openRestPwdDialog: (customClass?: string) => Promise<boolean>;
  openConfirmDialog: (customClass?: string) => Promise<boolean>;
  openInfoDialog: (
    title: string,
    content: string,
    customClass?: string
  ) => Promise<void>;
  openTicketConfirmDialog: (
    isCustmerPrize: boolean,
    inputCode: string,
    payType: any,
    productData: any,
    ticketList: any[]
  ) => Promise<any>;
  openDrawStepDialog: (drawData: any, customClass?: string) => Promise<boolean>;
  openImgDialog: (imgUrl: any, customClass?: string) => Promise<boolean>;
  openNewsBannerDialog: (
    newsBannerData: any,
    customClass?: string
  ) => Promise<boolean>;
}

export const FrontDialogContext = createContext<DialogContextType | undefined>(
  undefined
);
