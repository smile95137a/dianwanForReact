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
  openGrantRewardDialog: (memberList: any[]) => Promise<boolean>;
  openAddBannerDialog: (customClass?: string) => Promise<boolean>;
  openAddShipmentDialog: (
    isEdit?: boolean,
    shipment?: any,
    customClass?: string
  ) => Promise<boolean>;
  openAddRedemptionCodeDialog: (customClass?: string) => Promise<boolean>;
  openAddProductRecommendationDialog: (
    isEdit?: boolean,
    productRecommendation?: any,
    customClass?: string
  ) => Promise<boolean>;
  openAddNewsDialog: (isEdit?: boolean, news?: any) => Promise<boolean>;
  openAddStoreProductDialog: (
    isEdit?: boolean,
    storeProduct?: any
  ) => Promise<boolean>;
  openProductCategoryManagementDialog: (
    customClass?: string
  ) => Promise<boolean>;
  openAddProductCategoryDialog: (
    isEdit?: boolean,
    productCategory?: any
  ) => Promise<boolean>;
  openAddProductDialog: (isEdit?: boolean, product?: any) => Promise<boolean>;
  openOrderDetailsDialog: (order: any) => Promise<boolean>;
  openOrderShipmentDialog: (order: any) => Promise<boolean>;
}

export const BackendDialogContext = createContext<
  DialogContextType | undefined
>(undefined);
