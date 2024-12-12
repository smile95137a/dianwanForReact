import { ReactNode, FC } from 'react';
import ReactDOM from 'react-dom';
import { useConfirmDialog } from './ConfirmDialogProvider';
import { useInfoDialog } from './InfoDialogProvider';
import { useAddBannerDialog } from './AddBannerDialogProvider';
import { BackendDialogContext } from './BackendDialogContext';
import InfoDialog from '@/components/backend/dialog/InfoDialog';
import ConfirmDialog from '@/components/backend/dialog/ConfirmDialog';
import AddBannerDialog from '@/components/backend/dialog/AddBannerDialog';
import AddProductRecommendationDialog from '@/components/backend/dialog/AddProductRecommendationDialog';
import { useAddProductRecommendationDialog } from './AddProductRecommendationDialogProvider';
import { useAddRedemptionCodeDialog } from './AddRedemptionCodeDialogProvider';
import { useAddMemberDialog } from './AddMemberDialogProvider';
import AddMemberDialog from '@/components/backend/dialog/AddMemberDialog';
import { useAddShipmentDialog } from './AddShipmentDialogProvider';
import AddRedemptionCodeDialog from '@/components/backend/dialog/AddRedemptionCodeDialog';
import AddShipmentDialog from '@/components/backend/dialog/AddShipmentDialog';
import { useGrantRewardDialog } from './GrantRewardDialogProvider';
import GrantRewardDialog from '@/components/backend/dialog/GrantRewardDialog';
import AddNewsDialog from '@/components/backend/dialog/AddNewsDialog';
import { useAddNewsDialog } from './AddNewsDialogProvider';
import { useAddStoreProductDialog } from './AddStoreProductDialogProvider';
import AddStoreProductDialog from '@/components/backend/dialog/AddStoreProductDialog';

interface DialogProviderProps {
  children: ReactNode;
}

export const BackendDialogProvider: FC<DialogProviderProps> = ({
  children,
}) => {
  const {
    confirmDialogOpen,
    confirmTitle,
    confirmContent,
    customClass: confirmCustomClass,
    openConfirmDialog,
    closeConfirmDialog,
    confirmDialog,
  } = useConfirmDialog();

  const {
    infoDialogOpen,
    infoTitle,
    infoContent,
    customClass: infoCustomClass,
    openInfoDialog,
    closeInfoDialog,
  } = useInfoDialog();

  const {
    member,
    isMemberEdit,
    addMemberDialogOpen,
    openAddMemberDialog,
    closeAddMemberDialog,
    confirmAddMemberDialog,
  } = useAddMemberDialog();

  const {
    addBannerDialogOpen,
    customClass: addBannerCustomClass,
    openAddBannerDialog,
    closeAddBannerDialog,
    confirmAddBannerDialog,
  } = useAddBannerDialog();

  const {
    addProductRecommendationDialogOpen,
    customClass: addProductRecommendationCustomClass,
    openAddProductRecommendationDialog,
    closeAddProductRecommendationDialog,
    confirmAddProductRecommendationDialog,
  } = useAddProductRecommendationDialog();

  const {
    shipment,
    isEdit: isShipmentEdit,
    addShipmentDialogOpen,
    customClass: addShipmentDialogCustomClass,
    openAddShipmentDialog,
    closeAddShipmentDialog,
    confirmAddShipmentDialog,
  } = useAddShipmentDialog();

  const {
    addRedemptionCodeDialogOpen,
    customClass: addRedemptionCodeCustomClass,
    openAddRedemptionCodeDialog,
    closeAddRedemptionCodeDialog,
    confirmAddRedemptionCodeDialog,
  } = useAddRedemptionCodeDialog();

  const {
    memberList,
    grantRewardDialogOpen,
    openGrantRewardDialog,
    closeGrantRewardDialog,
    confirmGrantRewardDialog,
  } = useGrantRewardDialog();

  const {
    news,
    isNewsEdit,
    addNewsDialogOpen,
    openAddNewsDialog,
    closeAddNewsDialog,
    confirmAddNewsDialog,
  } = useAddNewsDialog();

  const {
    storeProduct,
    isEdit: isStoreProductEdit,
    addStoreProductDialogOpen,
    openAddStoreProductDialog,
    closeAddStoreProductDialog,
    confirmAddStoreProductDialog,
  } = useAddStoreProductDialog();

  return (
    <BackendDialogContext.Provider
      value={{
        openConfirmDialog,
        openInfoDialog,
        openAddBannerDialog,
        openAddProductRecommendationDialog,
        openAddMemberDialog,
        openAddShipmentDialog,
        openAddRedemptionCodeDialog,
        openGrantRewardDialog,
        openAddNewsDialog,
        openAddStoreProductDialog,
      }}
    >
      {children}
      {ReactDOM.createPortal(
        <>
          {addStoreProductDialogOpen && (
            <AddStoreProductDialog
              storeProduct={storeProduct}
              isEdit={isStoreProductEdit}
              isOpen={addStoreProductDialogOpen}
              onClose={closeAddStoreProductDialog}
              onConfirm={confirmAddStoreProductDialog}
            />
          )}

          {addNewsDialogOpen && (
            <AddNewsDialog
              news={member}
              isEdit={isNewsEdit}
              isOpen={addNewsDialogOpen}
              onClose={closeAddNewsDialog}
              onConfirm={confirmAddNewsDialog}
            />
          )}

          {addMemberDialogOpen && (
            <AddMemberDialog
              member={member}
              isEdit={isMemberEdit}
              isOpen={addMemberDialogOpen}
              onClose={closeAddMemberDialog}
              onConfirm={confirmAddMemberDialog}
            />
          )}

          {grantRewardDialogOpen && (
            <GrantRewardDialog
              memberList={memberList}
              isOpen={grantRewardDialogOpen}
              onClose={closeGrantRewardDialog}
              onConfirm={confirmGrantRewardDialog}
            />
          )}

          {addBannerDialogOpen && (
            <AddBannerDialog
              isOpen={addBannerDialogOpen}
              onClose={closeAddBannerDialog}
              onConfirm={confirmAddBannerDialog}
              customClass={addBannerCustomClass}
            />
          )}

          {addProductRecommendationDialogOpen && (
            <AddProductRecommendationDialog
              isOpen={addProductRecommendationDialogOpen}
              onClose={closeAddProductRecommendationDialog}
              onConfirm={confirmAddProductRecommendationDialog}
              customClass={addProductRecommendationCustomClass}
            />
          )}

          {addRedemptionCodeDialogOpen && (
            <AddRedemptionCodeDialog
              isOpen={addRedemptionCodeDialogOpen}
              onClose={closeAddRedemptionCodeDialog}
              onConfirm={confirmAddRedemptionCodeDialog}
              customClass={addProductRecommendationCustomClass}
            />
          )}

          {addShipmentDialogOpen && (
            <AddShipmentDialog
              shipment={shipment}
              isEdit={isShipmentEdit}
              isOpen={addShipmentDialogOpen}
              onClose={closeAddShipmentDialog}
              onConfirm={confirmAddShipmentDialog}
              customClass={addProductRecommendationCustomClass}
            />
          )}

          {confirmDialogOpen && (
            <ConfirmDialog
              isOpen={confirmDialogOpen}
              onClose={closeConfirmDialog}
              onConfirm={confirmDialog}
              title={confirmTitle}
              content={confirmContent}
              customClass={confirmCustomClass}
            />
          )}
          {infoDialogOpen && (
            <InfoDialog
              isOpen={infoDialogOpen}
              onClose={closeInfoDialog}
              title={infoTitle}
              content={infoContent}
              customClass={infoCustomClass}
            />
          )}
        </>,
        document.body
      )}
    </BackendDialogContext.Provider>
  );
};
