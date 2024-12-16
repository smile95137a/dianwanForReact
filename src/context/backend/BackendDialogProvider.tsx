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
import { useProductCategoryManagementDialog } from './ProductCategoryManagementDialogProvider';
import ProductCategoryManagementDialog from '@/components/backend/dialog/ProductCategoryManagementDialog';
import { useAddProductCategoryDialog } from './AddProductCategoryDialogProvider';
import AddProductCategoryDialog from '@/components/backend/dialog/AddProductCategoryDialog';
import { useAddProductDialog } from './AddProductDialogProvider';
import AddProductDialog from '@/components/backend/dialog/AddProductDialog';
import { useOrderDetailsDialog } from './OrderDetailsDialogProvider';
import OrderDetailsDialog from '@/components/backend/dialog/OrderDetailsDialog';
import { useOrderShipmentDialog } from './OrderShipmentDialogProvider';
import OrderShipmentDialog from '@/components/backend/dialog/OrderShipmentDialog';

interface DialogProviderProps {
  children: ReactNode;
}

export const BackendDialogProvider: FC<DialogProviderProps> = ({
  children,
}) => {
  const {
    productCategoryManagementDialogOpen,
    customClass: productCategoryManagementCustomClass,
    openProductCategoryManagementDialog,
    closeProductCategoryManagementDialog,
    confirmProductCategoryManagementDialog,
  } = useProductCategoryManagementDialog();

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
    productRecommendation,
    isEdit: isProductRecommendationEdit,
    addProductRecommendationDialogOpen,
    customClass: addProductRecommendationDialogCustomClass,
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
    order: orderByOrderDetailsDialog,
    orderDetailsDialogOpen,
    openOrderDetailsDialog,
    closeOrderDetailsDialog,
    confirmOrderDetailsDialog,
  } = useOrderDetailsDialog();

  const {
    order: orderByOrderShipmentDialog,
    orderShipmentDialogOpen,
    openOrderShipmentDialog,
    closeOrderShipmentDialog,
    confirmOrderShipmentDialog,
  } = useOrderShipmentDialog();

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

  const {
    productCategory,
    isProductCategoryEdit,
    addProductCategoryDialogOpen,
    openAddProductCategoryDialog,
    closeAddProductCategoryDialog,
    confirmAddProductCategoryDialog,
  } = useAddProductCategoryDialog();

  const {
    product,
    isEdit: isProductEdit,
    addProductDialogOpen,
    openAddProductDialog,
    closeAddProductDialog,
    confirmAddProductDialog,
  } = useAddProductDialog();

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
        openProductCategoryManagementDialog,
        openAddProductCategoryDialog,
        openAddProductDialog,
        openOrderDetailsDialog,
        openOrderShipmentDialog,
      }}
    >
      {children}
      {ReactDOM.createPortal(
        <>
          {orderDetailsDialogOpen && (
            <OrderDetailsDialog
              order={orderByOrderDetailsDialog}
              isOpen={orderDetailsDialogOpen}
              onClose={closeOrderDetailsDialog}
              onConfirm={confirmOrderDetailsDialog}
            />
          )}
          {orderShipmentDialogOpen && (
            <OrderShipmentDialog
              order={orderByOrderShipmentDialog}
              isOpen={orderShipmentDialogOpen}
              onClose={closeOrderShipmentDialog}
              onConfirm={confirmOrderShipmentDialog}
            />
          )}
          {productCategoryManagementDialogOpen && (
            <ProductCategoryManagementDialog
              isOpen={productCategoryManagementDialogOpen}
              onClose={closeProductCategoryManagementDialog}
              onConfirm={confirmProductCategoryManagementDialog}
              customClass={productCategoryManagementCustomClass}
            />
          )}

          {addProductCategoryDialogOpen && (
            <AddProductCategoryDialog
              productCategory={productCategory}
              isEdit={isProductCategoryEdit}
              isOpen={addProductCategoryDialogOpen}
              onClose={closeAddProductCategoryDialog}
              onConfirm={confirmAddProductCategoryDialog}
            />
          )}
          {addProductDialogOpen && (
            <AddProductDialog
              product={product}
              isEdit={isProductEdit}
              isOpen={addProductDialogOpen}
              onClose={closeAddProductDialog}
              onConfirm={confirmAddProductDialog}
            />
          )}
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
              productRecommendation={productRecommendation}
              isEdit={isProductRecommendationEdit}
              isOpen={addProductRecommendationDialogOpen}
              onClose={closeAddProductRecommendationDialog}
              onConfirm={confirmAddProductRecommendationDialog}
              customClass={addProductRecommendationDialogCustomClass}
            />
          )}

          {addRedemptionCodeDialogOpen && (
            <AddRedemptionCodeDialog
              isOpen={addRedemptionCodeDialogOpen}
              onClose={closeAddRedemptionCodeDialog}
              onConfirm={confirmAddRedemptionCodeDialog}
              customClass={addRedemptionCodeCustomClass}
            />
          )}

          {addShipmentDialogOpen && (
            <AddShipmentDialog
              shipment={shipment}
              isEdit={isShipmentEdit}
              isOpen={addShipmentDialogOpen}
              onClose={closeAddShipmentDialog}
              onConfirm={confirmAddShipmentDialog}
              customClass={addShipmentDialogCustomClass}
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
