import React, { FC, useEffect } from 'react';
import Dialog from './Dialog';
import { useFrontendDialog } from '@/context/frontend/useFrontedDialog';
import { delay } from '@/utils/DelayUtils';
import { useAnimateDialog } from '@/context/frontend/AnimateDialogProvider';
import { useDrawProductDialog } from '@/context/frontend/DrawProductDialogProvider';
import AnimateDialog from './AnimateDialog';
import DrawProductDialog from './DrawProductDialog';

interface DrawStepDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  customClass?: string;
  drawData: any;
}

const DrawStepDialog: FC<DrawStepDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  customClass,
  drawData,
}) => {
  const {
    animateDialogOpen,
    customClass: animateDialogCustomClass,
    openAnimateDialog,
    closeAnimateDialog,
    confirmAnimateDialog,
    drawData: animateDialogData,
  } = useAnimateDialog();
  const {
    drawProductDialogOpen,
    customClass: drawProductDialogCustomClass,
    openDrawProductDialog,
    closeDrawProductDialog,
    confirmDrawProductDialog,
    drawData: drawProductDialogData,
  } = useDrawProductDialog();

  const handleSkipClick = () => {
    onClose();
  };

  useEffect(() => {
    const handleDrawDataUpdate = async () => {
      if (drawData) {
        if (Array.isArray(drawData.drawItemList)) {
          for (const x of drawData.drawItemList) {
            await openAnimateDialog(x);
            await delay(500);
            await openDrawProductDialog(x);
            await delay(500);
          }
          onClose();
        }
      }
    };

    handleDrawDataUpdate();
  }, [drawData]);

  return (
    <>
      <div className="drawStepDialog">
        <div className="drawStepDialog__skip" onClick={handleSkipClick}>
          <p className="drawStepDialog__text">跳過</p>
        </div>
      </div>

      {animateDialogOpen && (
        <AnimateDialog
          isOpen={animateDialogOpen}
          onClose={closeAnimateDialog}
          onConfirm={confirmAnimateDialog}
          customClass={animateDialogCustomClass}
          drawData={animateDialogData}
        />
      )}
      {drawProductDialogOpen && (
        <DrawProductDialog
          isOpen={drawProductDialogOpen}
          onClose={closeDrawProductDialog}
          onConfirm={confirmDrawProductDialog}
          customClass={drawProductDialogCustomClass}
          drawData={drawProductDialogData}
        />
      )}
    </>
  );
};

export default DrawStepDialog;
