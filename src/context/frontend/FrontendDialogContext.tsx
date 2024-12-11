import { createContext } from 'react';

export interface DialogContextType {
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
