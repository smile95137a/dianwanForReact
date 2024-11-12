import { forwardRef, useEffect, useRef, useState } from 'react';
import { useController } from 'react-hook-form';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

interface Option {
  value: string;
  label: string;
}

interface MSelectProps {
  inputId?: string;
  name: string;
  options: Option[];
  value: string;
  onChange: (value: any) => void;
  error?: string | undefined;
  customClass?: string;
}

export const MSelect = forwardRef<HTMLInputElement, MSelectProps>(
  (
    { inputId, name, options, value, error, onChange, customClass = '' },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);
    const toggleSelectBox = () => {
      setIsOpen(!isOpen);
    };

    const handleOptionClick = (option: string) => {
      onChange({ target: { name, value: option } });
      setIsOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    return (
      <div
        className={`mselect ${customClass} ${error ? 'error' : ''} ${
          isOpen ? 'mselect--open' : ''
        }`}
        ref={selectRef}
      >
        <div className={`mselect__select`} onClick={toggleSelectBox}>
          <p className="mselect__select-text">
            {options?.find((option) => option.value === value)?.label}
          </p>
          <div className="mselect__select-icon">
            {isOpen ? <FaAngleUp /> : <FaAngleDown />}
          </div>
        </div>
        {isOpen && (
          <div className="mselect__options">
            {options.map((option, index) => (
              <div
                key={index}
                className={`mselect__option ${
                  option.label === value ? 'active' : ''
                }`}
                onClick={() => handleOptionClick(option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
        <input type="hidden" id={inputId} name={name} value={value} ref={ref} />
      </div>
    );
  }
);

export const FormSelect = ({ name, control, rules, ...restProps }: any) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: '',
    rules,
  });

  return (
    <MSelect
      value={field.value}
      onChange={field.onChange}
      error={error?.message}
      {...restProps}
    />
  );
};
