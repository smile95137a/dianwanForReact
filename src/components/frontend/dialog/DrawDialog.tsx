import React, { FC } from 'react';
import Dialog from './Dialog';
import logoImg from '@/assets/image/logo.png';
import NumberFormatter from '@/components/common/NumberFormatter';
import { getImageUrl } from '@/utils/ImageUtils';
interface DrawDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  customClass?: string;
  drawData: any;
}

const DrawDialog: FC<DrawDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  customClass,
  drawData,
}) => {
  const total = drawData.data.reduce(
    (sum: number, item: any) => sum + item.amount,
    0
  );
  return (
    <Dialog isOpen={isOpen} onClose={onClose} className={customClass}>
      <div className="drawDialog">
        <div className="drawDialog__header">
          <div className="drawDialog__logo">
            <img src={logoImg} className="drawDialog__logo-img" />
          </div>
        </div>
        <div className="drawDialog__title">
          <p className="drawDialog__text">抽中賞品</p>
        </div>
        <div className="drawDialog__main">
          {drawData?.data.map((item: any, index: any) => (
            <div key={index} className="drawDialog__item">
              <div className="drawDialog__item-img">
                {Array.isArray(item?.imageUrls) &&
                  item.imageUrls.length > 0 && (
                    <img src={getImageUrl(item.imageUrls[0])} alt="圖片" />
                  )}
              </div>
              <div className="drawDialog__item-name">{item.productName}</div>
            </div>
          ))}
        </div>
        <div className="drawDialog__footer">
          <div className="drawDialog__footer-content">
            <div className="drawDialog__footer-balance">
              <p className="drawDialog__text">
                目前剩餘
                <span className="drawDialog__text drawDialog__text--red">
                  <NumberFormatter number={drawData.remainingQuantity} />
                </span>
                抽
              </p>
            </div>
            <div className="drawDialog__footer-count">
              <p className="drawDialog__text">
                連續次數
                <span className="drawDialog__text  drawDialog__text--red">
                  <NumberFormatter number={drawData.data.length} />
                </span>
                抽
              </p>
            </div>
            <div className="drawDialog__footer-total">
              <p className="drawDialog__text ">
                共花費
                <span className="drawDialog__text  drawDialog__text--red drawDialog__text--bold">
                  <NumberFormatter number={total} />
                </span>
              </p>
            </div>
          </div>
          <div className="drawDialog__footer-btns">
            <div
              className="drawDialog__footer-btn drawDialog__footer-btn--cancel"
              onClick={onClose}
            >
              取消
            </div>
            <div
              className="drawDialog__footer-btn drawDialog__footer-btn--confirm"
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

export default DrawDialog;
