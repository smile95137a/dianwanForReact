import { ReactNode, FC } from 'react';
import ReactDOM from 'react-dom';
import { useConfirmDialog } from './ConfirmDialogProvider';
import { FrontDialogContext } from './FrontendDialogContext';
import ConfirmDialog from '@/components/frontend/dialog/ConfirmDialog';
import { useInfoDialog } from './InfoDialogProvider';
import InfoDialog from '@/components/frontend/dialog/InfoDialog';
import DrawDialog from '@/components/frontend/dialog/DrawDialog';
import { useDrawDialog } from './DrawDialogProvider';
import { useRestPwdDialog } from './RestPwdDialogProvider';
import RestPwdDialog from '@/components/frontend/dialog/RestPwdDialog';
import { useTicketConfirmDialog } from './TicketConfirmDialogProvider';
import TicketConfirmDialog from '@/components/frontend/dialog/TicketConfirmDialog';
import { useDrawStepDialog } from './DrawStepDialogProvider';
import DrawStepDialog from '@/components/frontend/dialog/DrawStepDialog';
import { useImgDialog } from './ImgDialogProvider';
import ImgDialog from '@/components/frontend/dialog/ImgDialog';

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
    payType,
    productData,
    ticketList,
    ticketConfirmDialogOpen,
    openTicketConfirmDialog,
    closeTicketConfirmDialog,
    ticketConfirmDialog,
  } = useTicketConfirmDialog();

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
    drawStepDialogOpen,
    customClass: drawStepDialogCustomClass,
    openDrawStepDialog,
    closeDrawStepDialog,
    confirmDrawStepDialog,
    drawData: drawStepDialogData,
  } = useDrawStepDialog();

  const {
    restPwdDialogOpen,
    customClass: restPwdDialogCustomClass,
    openRestPwdDialog,
    closeRestPwdDialog,
    confirmRestPwdDialog,
  } = useRestPwdDialog();

  const {
    imgDialogOpen,
    customClass: imgDialogCustomClass,
    openImgDialog,
    closeImgDialog,
    confirmImgDialog,
    imgUrl,
  } = useImgDialog();

  return (
    <FrontDialogContext.Provider
      value={{
        openConfirmDialog,
        openInfoDialog,
        openDrawDialog,
        openRestPwdDialog,
        openTicketConfirmDialog,
        openDrawStepDialog,
        openImgDialog,
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
          {ticketConfirmDialogOpen && (
            <TicketConfirmDialog
              payType={payType}
              productData={productData}
              ticketList={ticketList}
              isOpen={ticketConfirmDialogOpen}
              onClose={closeTicketConfirmDialog}
              onConfirm={ticketConfirmDialog}
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

          {drawStepDialogOpen && (
            <DrawStepDialog
              isOpen={drawStepDialogOpen}
              onClose={closeDrawStepDialog}
              onConfirm={confirmDrawStepDialog}
              customClass={drawStepDialogCustomClass}
              drawData={drawStepDialogData}
            />
          )}

          {imgDialogOpen && (
            <ImgDialog
              isOpen={imgDialogOpen}
              onClose={closeImgDialog}
              onConfirm={confirmImgDialog}
              customClass={imgDialogCustomClass}
              imgUrl={imgUrl}
            />
          )}
        </>,
        document.body
      )}
    </FrontDialogContext.Provider>
  );
};
