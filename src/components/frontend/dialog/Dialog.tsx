import React, { FC, ReactNode } from 'react';

interface DialogProps {
  isOpen: boolean;
  onClose: (result: boolean) => void;
  children: ReactNode;
  className?: string;
}

const Dialog: FC<DialogProps> = ({ isOpen, onClose, children, className }) => {
  if (!isOpen) return null;

  const handleClose = (result: boolean) => {
    onClose(result);
  };

  return (
    <div className={`dialog ${className ? className : ''}`}>
      <div className="dialog__overlay" onClick={() => handleClose(false)}></div>
      <div className="dialog__main">{children}</div>
    </div>
  );
};

export default Dialog;
