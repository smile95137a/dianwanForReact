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
import { useAddMemberDialog } from './AddMemberDialogProvider';
import AddMemberDialog from '@/components/backend/dialog/AddMemberDialog';

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

  return (
    <BackendDialogContext.Provider
      value={{
        openConfirmDialog,
        openInfoDialog,
        openAddBannerDialog,
        openAddProductRecommendationDialog,
        openAddMemberDialog,
      }}
    >
      {children}
      {ReactDOM.createPortal(
        <>
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

          {addMemberDialogOpen && (
            <AddMemberDialog
              member={member}
              isEdit={isMemberEdit}
              isOpen={addMemberDialogOpen}
              onClose={closeAddMemberDialog}
              onConfirm={confirmAddMemberDialog}
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
        </>,
        document.body
      )}
    </BackendDialogContext.Provider>
  );
};
