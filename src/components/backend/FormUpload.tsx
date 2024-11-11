import { genRandom } from '@/utils/RandomUtils';
import { ChangeEvent, forwardRef } from 'react';
import { useController } from 'react-hook-form';
import { FaVideo, FaPlay, FaImage, FaCloud } from 'react-icons/fa';
import { IoMdListBox } from 'react-icons/io';

interface MUploadProps {
  inputId?: string;
  onChange: (value: any) => void;
  name?: string;
  error?: string | undefined;
}

const MUpload = forwardRef<HTMLInputElement, MUploadProps>(
  ({ inputId = genRandom(32), onChange, name, error }, ref) => {
    const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files && event.target.files[0];
      if (file && onChange) {
        onChange({ target: { name, value: file } });
      }
    };

    return (
      <div className={`upload ${error ? 'error' : ''}`}>
        <div className="upload__logo">
          <div className="upload__icon upload__icon--cloud">
            <FaCloud />
          </div>
        </div>
        <div className="upload__icons">
          <div className="upload__icon upload__icon--video">
            <FaVideo />
          </div>
          <div className="upload__icon upload__icon--list">
            <IoMdListBox />
          </div>
          <div className="upload__icon upload__icon--music">
            <FaPlay />
          </div>
          <div className="upload__icon upload__icon--image">
            <FaImage />
          </div>
        </div>
        <input
          type="file"
          className="upload__input"
          onChange={handleChange}
          id={inputId}
          ref={ref}
          name={name}
        />
        {error && <div className="upload__error">{error}</div>}
      </div>
    );
  }
);

const FormUpload = ({ name, control, rules, ...restProps }: any) => {
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
    <MUpload
      onChange={field.onChange}
      error={error?.message}
      name={name}
      {...restProps}
    />
  );
};

export { MUpload, FormUpload };
