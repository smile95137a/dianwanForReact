import React, { FC } from 'react';
import Dialog from './Dialog';
import NumberFormatter from '@/components/common/NumberFormatter';
import { getImageUrl } from '@/utils/ImageUtils';
interface DrawProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  customClass?: string;
  drawData: any;
}

const DrawProductDialog: FC<DrawProductDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  customClass,
  drawData,
}) => {
  setTimeout(() => {
    onClose();
  }, 1000);
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      className={`dialog--drawProduct ${customClass}`}
    >
      <div className="drawProductDialog">
        <div className="drawProductDialog__header">
          <p className="drawProductDialog__text">
            恭喜您從
            <span className="drawProductDialog__text drawProductDialog__text--red">
              <NumberFormatter number={~~drawData.prizeNumber} />
            </span>
            號獎籤抽到
          </p>
        </div>

        <div className="drawProductDialog__main">
          <div className="drawProductDialog__main-img">
            {Array.isArray(drawData?.imageUrls) &&
              drawData.imageUrls.length > 0 && (
                <img src={getImageUrl(drawData.imageUrls[0])} alt="產品圖片" />
              )}
          </div>
          <p className="drawProductDialog__text">
            {drawData.level}賞{drawData.productName}
          </p>
        </div>
      </div>
    </Dialog>
  );
};

export default DrawProductDialog;
