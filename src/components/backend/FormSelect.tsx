import { forwardRef, useEffect, useRef, useState } from 'react';
import { useController } from 'react-hook-form';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

interface Option {
  value: string;
  label: string;
}

interface BSelectProps {
  inputId?: string;
  name: string;
  options: Option[];
  value: string;
  onChange: (value: any) => void;
  error?: string | undefined;
}

const BSelect = forwardRef<HTMLInputElement, BSelectProps>(
  ({ inputId, name, options, value, error, onChange }, ref) => {
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
        className={`bselect ${error ? 'error' : ''} ${
          isOpen ? 'bselect--open' : ''
        }`}
        ref={selectRef}
      >
        <div className={`bselect__select`} onClick={toggleSelectBox}>
          <p className="bselect__select-text">
            {options?.find((option) => option.value === value)?.label}
          </p>
          <div className="bselect__select-icon">
            {isOpen ? <FaAngleUp /> : <FaAngleDown />}
          </div>
        </div>
        {isOpen && (
          <div className="bselect__options">
            {options.map((option, index) => (
              <div
                key={index}
                className={`bselect__option ${
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
    <BSelect
      value={field.value}
      onChange={field.onChange}
      error={error?.message}
      {...restProps}
    />
  );
};
