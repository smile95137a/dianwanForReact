import React, { FC } from 'react';
import Dialog from './Dialog';
import logoImg from '@/assets/image/logo.png';
interface confirmDialogProps {
  isOpen: boolean;
  title?: string;
  content: string;
  onClose: () => void;
  onConfirm: () => void;
  customClass?: string;
}

const ConfirmDialog: FC<confirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = '系統提示',
  content,
  customClass,
}) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      className={`dialog--info ${customClass || ''}`}
    >
      <div className="confirmDialog">
        <div className="confirmDialog__header">
          <div className="confirmDialog__logo">
            <img src={logoImg} className="confirmDialog__logo-img" />
          </div>
        </div>
        <div className="confirmDialog__title">
          <p className="confirmDialog__text">{title}</p>
        </div>
        <div className="confirmDialog__main">{content}</div>
        <div className="confirmDialog__footer">
          <div className="confirmDialog__footer-btns">
            <div
              className="confirmDialog__footer-btn confirmDialog__footer-btn--confirm"
              onClick={onClose}
            >
              確認
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ConfirmDialog;
