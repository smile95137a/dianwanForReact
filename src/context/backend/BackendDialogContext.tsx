import { createContext } from 'react';

export interface DialogContextType {
  openConfirmDialog: (
    title: string,
    content: string,
    customClass?: string
  ) => Promise<boolean>;
  openInfoDialog: (
    title: string,
    content: string,
    customClass?: string
  ) => Promise<void>;
  openAddMemberDialog: (isEdit?: boolean, user?: any) => Promise<boolean>;
  openAddBannerDialog: (customClass?: string) => Promise<boolean>;
  openAddProductRecommendationDialog: (
    customClass?: string
  ) => Promise<boolean>;
}

export const BackendDialogContext = createContext<
  DialogContextType | undefined
>(undefined);
