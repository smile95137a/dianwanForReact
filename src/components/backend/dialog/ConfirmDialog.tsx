import { FC } from 'react';
import { FaQuestion } from 'react-icons/fa6';
import BDialog from './BDialog';
import MButton from '../MButton';

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  content: string;
  onClose: () => void;
  onConfirm: () => void;
  customClass?: string;
}

const ConfirmDialog: FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  content,
  customClass,
}) => {
  return (
    <BDialog
      isOpen={isOpen}
      onClose={onClose}
      className={`${customClass} bdialog--bconfirmDialog`}
    >
      <div className="bconfirmDialog">
        <div className="bconfirmDialog__icon">
          <div className="bconfirmDialog__icon-icon">
            <FaQuestion />
          </div>
        </div>

        <div className="bconfirmDialog__info">
          {title && (
            <div className="bconfirmDialog__info-title">
              <p className="bconfirmDialog__text">{title}</p>
            </div>
          )}
          <div className="bconfirmDialog__info-content">
            <p className="bconfirmDialog__text">{content}</p>
          </div>
          <div className="bconfirmDialog__info-btns">
            <MButton text={'取消'} click={onClose} />
            <MButton text={'確定'} click={onConfirm} />
          </div>
        </div>
      </div>
    </BDialog>
  );
};

export default ConfirmDialog;
