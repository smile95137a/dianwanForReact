import React, { FC } from 'react';
import Dialog from './Dialog';
import NumberFormatter from '@/components/common/NumberFormatter';
import { getImageUrl } from '@/utils/ImageUtils';
interface ImgDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  customClass?: string;
  imgUrl: any;
}

const ImgDialog: FC<ImgDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  customClass,
  imgUrl,
}) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      className={`dialog--img ${customClass}`}
    >
      <div className="imgDialog">
        <img src={getImageUrl(imgUrl)} alt="商品圖片" />
      </div>
    </Dialog>
  );
};

export default ImgDialog;
