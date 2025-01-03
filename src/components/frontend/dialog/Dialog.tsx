import React, { FC, ReactNode } from 'react';

interface DialogProps {
  isOpen: boolean;
  onClose: (result: boolean) => void;
  children: ReactNode;
  className?: string;
  canCloseOnOverlayClick?: boolean; // New prop
}

const Dialog: FC<DialogProps> = ({
  isOpen,
  onClose,
  children,
  className,
  canCloseOnOverlayClick = true,
}) => {
  if (!isOpen) return null;

  const handleClose = (result: boolean) => {
    onClose(result);
  };

  const handleOverlayClick = () => {
    if (canCloseOnOverlayClick) {
      handleClose(false);
    }
  };

  return (
    <div className={`dialog ${className ? className : ''}`}>
      <div className="dialog__overlay" onClick={handleOverlayClick}></div>
      <div className="dialog__main">{children}</div>
    </div>
  );
};

export default Dialog;
