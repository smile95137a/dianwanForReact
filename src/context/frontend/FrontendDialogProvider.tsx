import { ReactNode, FC } from 'react';
import ReactDOM from 'react-dom';
import { useConfirmDialog } from './ConfirmDialogProvider';
import { FrontDialogContext } from './FrontendDialogContext';
import ConfirmDialog from '@/components/frontend/dialog/ConfirmDialog';
import { useInfoDialog } from './InfoDialogProvider';
import InfoDialog from '@/components/frontend/dialog/InfoDialog';
import DrawDialog from '@/components/frontend/dialog/DrawDialog';
import { useDrawDialog } from './DrawDialogProvider';
import { useAnimateDialog } from './AnimateDialogProvider';
import AnimateDialog from '@/components/frontend/dialog/AnimateDialog';
import { useRestPwdDialog } from './RestPwdDialogProvider';
import RestPwdDialog from '@/components/frontend/dialog/RestPwdDialog';

interface DialogProviderProps {
  children: ReactNode;
}

export const FrontendDialogProvider: FC<DialogProviderProps> = ({
  children,
}) => {
  const {
    confirmDialogOpen,
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
    drawDialogOpen,
    customClass: drawCustomClass,
    openDrawDialog,
    closeDrawDialog,
    confirmDrawDialog,
    drawData,
  } = useDrawDialog();

  const {
    animateDialogOpen,
    customClass: animateDialogCustomClass,
    openAnimateDialog,
    closeAnimateDialog,
    confirmAnimateDialog,
    drawData: animateDialogData,
  } = useAnimateDialog();

  const {
    restPwdDialogOpen,
    customClass: restPwdDialogCustomClass,
    openRestPwdDialog,
    closeRestPwdDialog,
    confirmRestPwdDialog,
  } = useRestPwdDialog();

  return (
    <FrontDialogContext.Provider
      value={{
        openConfirmDialog,
        openInfoDialog,
        openDrawDialog,
        openAnimateDialog,
        openRestPwdDialog,
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
              customClass={confirmCustomClass}
              content={''}
            />
          )}
          {restPwdDialogOpen && (
            <RestPwdDialog
              isOpen={restPwdDialogOpen}
              onClose={closeRestPwdDialog}
              onConfirm={confirmRestPwdDialog}
              customClass={restPwdDialogCustomClass}
            />
          )}

          {drawDialogOpen && (
            <DrawDialog
              isOpen={drawDialogOpen}
              onClose={closeDrawDialog}
              onConfirm={confirmDrawDialog}
              customClass={drawCustomClass}
              drawData={drawData}
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

          {animateDialogOpen && (
            <AnimateDialog
              isOpen={animateDialogOpen}
              onClose={closeAnimateDialog}
              onConfirm={confirmAnimateDialog}
              customClass={animateDialogCustomClass}
              drawData={animateDialogData}
            />
          )}
        </>,
        document.body
      )}
    </FrontDialogContext.Provider>
  );
};
