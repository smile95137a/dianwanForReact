import { FC } from 'react';
import { FaInfo } from 'react-icons/fa';
import BDialog from './BDialog';
interface InfoDialogProps {
  isOpen: boolean;
  title?: string;
  content: string;
  onClose: () => void;
  customClass?: string;
}

const InfoDialog: FC<InfoDialogProps> = ({
  isOpen,
  onClose,
  title,
  content,
  customClass,
}) => {
  return (
    <BDialog isOpen={isOpen} onClose={onClose} className={customClass}>
      <div className="binfoDialog">
        <div className="binfoDialog__icon">
          <div className="binfoDialog__icon-icon">
            <FaInfo />
          </div>
        </div>

        <div className="binfoDialog__info">
          {title && (
            <div className="binfoDialog__info-title">
              <p className="binfoDialog__text">{title}</p>
            </div>
          )}
          <div className="binfoDialog__info-content">
            <p className="binfoDialog__text">{content}</p>
          </div>
          <div className="binfoDialog__info-btns"></div>
        </div>
      </div>
    </BDialog>
  );
};

export default InfoDialog;
