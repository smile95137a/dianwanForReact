import React, { FC } from 'react';
import Dialog from './Dialog';
import logoImg from '@/assets/image/logo.png';
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  customClass?: string;
}

const ConfirmDialog: FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  customClass,
}) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} className={customClass}>
      <div className="confirmDialog">
        <div className="confirmDialog__header">
          <div className="confirmDialog__logo">
            <img src={logoImg} className="confirmDialog__logo-img" />
          </div>
        </div>
        <div className="confirmDialog__title">
          <p className="confirmDialog__text">抽中賞品</p>
        </div>
        <div className="confirmDialog__main">
          {[...Array(20)].map((_, index) => (
            <div key={index} className="confirmDialog__item">
              <div className="confirmDialog__item-img">
                <img src={logoImg} />
              </div>
              <div className="confirmDialog__item-name">
                [日版] 一番賞 《我的英雄學院》正義的形式 現貨！
              </div>
            </div>
          ))}
        </div>
        <div className="confirmDialog__footer">
          <div className="confirmDialog__footer-content">
            <div className="confirmDialog__footer-balance">
              <p className="confirmDialog__text">
                目前剩餘
                <span className="confirmDialog__text confirmDialog__text--red">
                  71
                </span>
                抽
              </p>
            </div>
            <div className="confirmDialog__footer-count">
              <p className="confirmDialog__text">
                連續次數
                <span className="confirmDialog__text  confirmDialog__text--red">
                  3
                </span>
                抽
              </p>
            </div>
            <div className="confirmDialog__footer-total">
              <p className="confirmDialog__text ">
                共花費
                <span className="confirmDialog__text  confirmDialog__text--red confirmDialog__text--bold">
                  1080
                </span>
              </p>
            </div>
          </div>
          <div className="confirmDialog__footer-btns">
            <div
              className="confirmDialog__footer-btn confirmDialog__footer-btn--cancel"
              onClick={onClose}
            >
              取消
            </div>
            <div
              className="confirmDialog__footer-btn confirmDialog__footer-btn--confirm"
              onClick={onConfirm}
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
