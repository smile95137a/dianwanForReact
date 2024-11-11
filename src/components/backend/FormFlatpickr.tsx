import Flatpickr from 'react-flatpickr';
import { useController } from 'react-hook-form';
import 'flatpickr/dist/flatpickr.min.css';
import moment from 'moment';

export const MFlatpickr = ({
  labelText,
  placeholderText = '',
  options = {},
  value,
  onChange,
  disabled,
  error,
}: any) => {
  return (
    <div className={`mflatpickr ${error ? 'error' : ''}`}>
      <Flatpickr
        value={value}
        options={options}
        onChange={onChange}
        className="mflatpickr__input"
        placeholder={placeholderText}
        disabled={disabled}
      />
      <label className="mflatpickr__label">{labelText}</label>
      {error && <span className="mflatpickr__error">{error}</span>}
    </div>
  );
};

export const FormFlatpickr = ({ name, control, rules, ...restProps }: any) => {
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
    <MFlatpickr
      value={field.value}
      onChange={([selectedDate]: [Date]) => {
        const convertedDate = moment(selectedDate).format('YYYY-MM-DDTHH:mm');
        field.onChange(convertedDate);
      }}
      error={error?.message}
      {...restProps}
    />
  );
};
