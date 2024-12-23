import { createContext } from 'react';

export interface DialogContextType {
  openDrawDialog: (drawData: any, customClass?: string) => Promise<boolean>;
  openRestPwdDialog: (customClass?: string) => Promise<boolean>;
  openAnimateDialog: (drawData: any, customClass?: string) => Promise<boolean>;
  openConfirmDialog: (customClass?: string) => Promise<boolean>;
  openInfoDialog: (
    title: string,
    content: string,
    customClass?: string
  ) => Promise<void>;
}

export const FrontDialogContext = createContext<DialogContextType | undefined>(
  undefined
);
