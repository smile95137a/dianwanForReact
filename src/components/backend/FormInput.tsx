import { forwardRef, ElementType, ChangeEvent, useState } from 'react';
import { useController } from 'react-hook-form';
import { genRandom } from '@/utils/RandomUtils';

type BInputProps = {
  inputId?: string;
  placeholderText?: string;
  labelText: string;
  type?: string;
  Icon?: ElementType;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  value?: string | undefined;
  name?: string;
  error?: string | undefined;
  disabled?: boolean;
  readOnly?: boolean;
};

const BInput = forwardRef<HTMLInputElement, BInputProps>(
  (
    {
      inputId = genRandom(32),
      placeholderText = '',
      labelText,
      type = 'text',
      Icon,
      onChange,
      value,
      name,
      error,
      disabled,
      readOnly,
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleIcon = () => {
      if (type === 'password') {
        setShowPassword(!showPassword);
      }
    };

    return (
      <div className={`binput ${error ? 'error' : ''}`}>
        <input
          type={type === 'password' && showPassword ? 'text' : type}
          id={inputId}
          className="binput__input"
          placeholder={placeholderText}
          onChange={onChange}
          value={value}
          name={name}
          ref={ref}
          disabled={disabled}
          readOnly={readOnly}
        />
        <label className="binput__label" htmlFor={inputId}>
          {labelText}
        </label>
        {Icon && (
          <div className="binput__icon" onClick={toggleIcon}>
            <Icon />
          </div>
        )}
      </div>
    );
  }
);

export const FormInput = ({ name, control, rules, ...restProps }: any) => {
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
    <BInput
      value={field.value}
      onChange={field.onChange}
      error={error?.message}
      {...restProps}
    />
  );
};
