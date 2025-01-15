import React, { FC } from 'react';
import Dialog from './Dialog';
import logoImg from '@/assets/image/logo.png';
interface infoDialogProps {
  isOpen: boolean;
  title?: string;
  content: string;
  onClose: () => void;
  customClass?: string;
}

const InfoDialog: FC<infoDialogProps> = ({
  isOpen,
  onClose,
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
      <div className="infoDialog">
        <div className="infoDialog__header">
          <div className="infoDialog__logo">
            <img src={logoImg} className="infoDialog__logo-img" />
          </div>
        </div>
        <div className="infoDialog__title">
          <p className="infoDialog__text">{title}</p>
        </div>

        <div
          className="infoDialog__main"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        <div className="infoDialog__footer">
          <div className="infoDialog__footer-btns">
            <div
              className="infoDialog__footer-btn infoDialog__footer-btn--confirm"
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

export default InfoDialog;
