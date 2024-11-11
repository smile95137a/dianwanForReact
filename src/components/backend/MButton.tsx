import { ReactNode } from 'react';

interface IMButtonProps {
  click?: () => void;
  text: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  customClass?: string;
  customTextClass?: string;
  disabled?: boolean;
}

const MButton = ({
  click,
  text,
  type = 'button',
  customClass = '',
  customTextClass = '',
  disabled = false,
}: IMButtonProps) => {
  return (
    <button
      className={`mbtn ${customClass}`}
      onClick={click}
      type={type}
      disabled={disabled}
    >
      <span className={`mbtn__text ${customTextClass}`}>{text}</span>
    </button>
  );
};

export default MButton;
