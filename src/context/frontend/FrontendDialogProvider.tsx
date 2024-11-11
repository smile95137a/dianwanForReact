import { ReactNode, FC } from 'react';
import ReactDOM from 'react-dom';
import { useConfirmDialog } from './ConfirmDialogProvider';
import { FrontDialogContext } from './FrontendDialogContext';
import ConfirmDialog from '@/components/frontend/dialog/ConfirmDialog';

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

  return (
    <FrontDialogContext.Provider
      value={{
        openConfirmDialog,
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
            />
          )}
        </>,
        document.body
      )}
    </FrontDialogContext.Provider>
  );
};
