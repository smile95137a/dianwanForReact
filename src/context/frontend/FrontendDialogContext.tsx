import { createContext } from 'react';

export interface DialogContextType {
  openConfirmDialog: (customClass?: string) => Promise<boolean>;
}

export const FrontDialogContext = createContext<DialogContextType | undefined>(
  undefined
);
