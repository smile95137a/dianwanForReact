import { genRandom } from '@/utils/RandomUtils';
import { forwardRef, ChangeEvent } from 'react';
import { useController } from 'react-hook-form';

type MToggleeProps = {
  inputId?: string;
  onChange: (value: any) => void;
  checked?: boolean;
  name?: string;
  error?: string | undefined;
};

const MTogglee = forwardRef<HTMLInputElement, MToggleeProps>(
  ({ inputId = genRandom(32), onChange, checked, name, error }, ref) => {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked;
      if (onChange) {
        onChange({ target: { name, value: isChecked } });
      }
    };

    return (
      <div className={`mtogglee ${error ? 'error' : ''}`}>
        <input
          className="mtogglee__input"
          id={inputId}
          type="checkbox"
          onChange={handleChange}
          checked={checked}
          ref={ref}
          name={name}
        />
        <label className="mtogglee__btn" htmlFor={inputId}></label>
      </div>
    );
  }
);

export const FormToggle = ({ name, control, rules, ...restProps }: any) => {
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
    <MTogglee
      checked={field.value}
      onChange={field.onChange}
      error={error?.message}
      {...restProps}
    />
  );
};
