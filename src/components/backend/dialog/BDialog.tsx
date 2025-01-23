import React, { FC, ReactNode } from 'react';

interface DialogProps {
  isOpen: boolean;
  onClose: (result: boolean) => void;
  children: ReactNode;
  customClassName?: string;
  overlayClassName?: string;
  mainClassName?: string;
}

const BDialog: FC<DialogProps> = ({
  isOpen,
  onClose,
  children,
  customClassName = '',
  overlayClassName = '',
  mainClassName = '',
}) => {
  if (!isOpen) return null;

  const handleClose = (result: boolean) => {
    onClose(result);
  };

  return (
    <div className={`bdialog ${customClassName}`}>
      <div
        className={`bdialog__overlay ${overlayClassName}`}
        onClick={() => handleClose(false)}
      ></div>
      <div className={`bdialog__main ${mainClassName}`}>{children}</div>
    </div>
  );
};

export default BDialog;
