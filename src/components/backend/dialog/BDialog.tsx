import React, { FC, ReactNode } from 'react';

interface DialogProps {
  isOpen: boolean;
  onClose: (result: boolean) => void;
  children: ReactNode;
  className?: string;
}

const BDialog: FC<DialogProps> = ({ isOpen, onClose, children, className }) => {
  if (!isOpen) return null;

  const handleClose = (result: boolean) => {
    onClose(result);
  };

  return (
    <div className={`bdialog ${className ? className : ''}`}>
      <div
        className="bdialog__overlay"
        onClick={() => handleClose(false)}
      ></div>
      <div className="bdialog__main">{children}</div>
    </div>
  );
};

export default BDialog;
