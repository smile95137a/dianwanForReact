import React, { FC, useEffect } from 'react';
import BDialog from './BDialog';
import MButton from '../MButton';
import { useForm } from 'react-hook-form';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {
  createNews,
  updateNews,
  uploadImage,
} from '@/services/backend/NewsService';
import { useBackendDialog } from '@/context/backend/useBackendDialog';
import { useLoading } from '@/context/frontend/LoadingContext';
import { NewsStatus } from '@/services/backend/NewsService';
import { FormInput } from '../FormInput';
import { FormSelect } from '../FormSelect';
import CustomUploadAdapterPlugin from './CustomeUoload';
interface AddNewsDialogProps {
  isOpen: boolean;
  onClose: (result: boolean) => void;
  onConfirm: () => void;
  isEdit?: boolean;
  news?: any;
}

const editorConfig = {
  licenseKey: 'GPL',
  toolbar: [
    'heading',
    '|',
    'bold',
    'italic',
    'link',
    'bulletedList',
    'numberedList',
    'blockQuote',
    '|',
    'uploadImage',
    'undo',
    'redo',
  ],
  image: {
    toolbar: ['imageTextAlternative', 'imageStyle:full', 'imageStyle:side'],
  },
  extraPlugins: [CustomUploadAdapterPlugin],
};

const AddNewsDialog: FC<AddNewsDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isEdit = false,
  news,
}) => {
  const { control, reset, getValues, setValue, watch } = useForm({
    defaultValues: {
      title: '',
      preview: '',
      content: '',
      status: NewsStatus.UNAVAILABLE,
      author: '',
      imageFiles: [] as File[],
      imageUrls: [] as string[],
    },
  });

  const { openInfoDialog } = useBackendDialog();
  const { setLoading } = useLoading();
  const imageFiles = watch('imageFiles');
  const imageUrls = watch('imageUrls');

  useEffect(() => {
    const defaultValues = {
      title: '',
      preview: '',
      content: '',
      status: NewsStatus.UNAVAILABLE,
      author: '',
      imageFiles: [],
      imageUrls: [],
    };

    if (isEdit && news) {
      defaultValues.title = news.title || '';
      defaultValues.preview = news.preview || '';
      defaultValues.content = news.content || '';
      defaultValues.status = news.status || NewsStatus.UNAVAILABLE;
      defaultValues.author = news.author || '';
      defaultValues.imageFiles = news.imageFiles || [];
      defaultValues.imageUrls = news.imageUrls || [];
    }

    reset(defaultValues);
  }, [isEdit, news, reset]);

  const validateForm = async () => {
    const { title, preview, content, author } = getValues();
    try {
      if (!title.trim()) throw new Error('標題為必填項！');
      if (!preview.trim()) throw new Error('摘要為必填項！');
      if (!content.trim()) throw new Error('內容為必填項！');
      return true;
    } catch (error) {
      if (error instanceof Error)
        await openInfoDialog('系統提示', error.message);
      return false;
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setValue('imageFiles', [...imageFiles, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    setValue(
      'imageFiles',
      imageFiles.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async () => {
    if (await validateForm()) {
      const { title, preview, content, status, author, imageUrls } =
        getValues();
      const formData = new FormData();

      formData.append(
        'newsReq',
        JSON.stringify({ title, preview, content, status, author, imageUrls })
      );

      imageFiles.forEach((file) => {
        formData.append('images', file);
      });

      try {
        setLoading(true);
        const { success, message } = isEdit
          ? await updateNews(news.newsUid, formData)
          : await createNews(formData);

        setLoading(false);

        if (success) {
          await openInfoDialog(
            '系統提示',
            isEdit ? '新聞更新成功！' : '新聞新增成功！'
          );
          onClose(true);
          onConfirm();
        } else {
          await openInfoDialog('系統提示', message || '操作失敗，請稍後再試！');
        }
      } catch (error) {
        setLoading(false);
        console.error('操作失敗:', error);
        await openInfoDialog('系統提示', '操作過程中出現錯誤，請稍後再試！');
      }
    }
  };

  return (
    <BDialog
      isOpen={isOpen}
      onClose={() => onClose(false)}
      mainClassName="max-w-640"
    >
      <div className="addNewsDialog">
        <p className="addNewsDialog__text addNewsDialog__text--title">
          {isEdit ? '編輯新聞' : '新增新聞'}
        </p>
        <div className="addNewsDialog__main">
          <div className="flex">
            <div className="w-100">
              <p className="addMemberDialog__text">標題:</p>
            </div>
            <FormInput name="title" control={control} />
          </div>
          <div className="flex">
            <div className="w-100">
              <p className="addMemberDialog__text">預覽:</p>
            </div>
            <FormInput name="preview" control={control} />
          </div>

          <div className="flex flex-wrap">
            <div className="w-100">
              <p className="addMemberDialog__text">內容:</p>
            </div>
            <div className="w-100 editor-container">
              <CKEditor
                editor={ClassicEditor}
                config={editorConfig}
                data={watch('content')}
                onChange={(_, editor) => {
                  const data = editor.getData();
                  setValue('content', data);
                }}
              />
            </div>
          </div>

          <div className="flex">
            <div className="w-100">
              <p className="addMemberDialog__text">上傳圖片:</p>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
            />
            <div className="image-preview">
              {imageFiles.map((file, index) => (
                <div key={index} className="image-item">
                  <img src={URL.createObjectURL(file)} alt="圖片預覽" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="remove-image"
                  >
                    移除
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex">
            <div className="w-100">
              <p className="addMemberDialog__text">狀態:</p>
            </div>
            <FormSelect
              name="status"
              control={control}
              options={[
                { value: NewsStatus.AVAILABLE, label: '可用' },
                { value: NewsStatus.UNAVAILABLE, label: '不可用' },
              ]}
            />
          </div>
        </div>
        <div className="addNewsDialog__btns">
          <MButton
            text={'取消'}
            customClass="addNewsDialog__btn"
            click={() => onClose(false)}
          />
          <MButton
            text={isEdit ? '儲存' : '新增'}
            customClass="addNewsDialog__btn"
            click={handleSubmit}
          />
        </div>
      </div>
    </BDialog>
  );
};

export default AddNewsDialog;
