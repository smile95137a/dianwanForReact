import React, { FC, useEffect, useState } from 'react';
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

interface AddNewsDialogProps {
  isOpen: boolean;
  onClose: (result: boolean) => void;
  onConfirm: () => void;
  isEdit?: boolean;
  news?: any;
}

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
      Object.assign(defaultValues, news);
    }
    reset(defaultValues);
  }, [isEdit, news, reset]);

  const validateForm = async () => {
    const { title, preview, content, author } = getValues();
    try {
      if (!title.trim()) throw new Error('標題為必填項！');
      if (!preview.trim()) throw new Error('摘要為必填項！');
      if (!content.trim()) throw new Error('內容為必填項！');
      if (!author.trim()) throw new Error('作者為必填項！');
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
      const { title, preview, content, status, author } = getValues();
      const formData = new FormData();

      formData.append(
        'newsReq',
        JSON.stringify({ title, preview, content, status, author })
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

  const customUploadAdapter = (loader: any) => ({
    upload: async () => {
      const file = await loader.file;
      const response = await uploadImage(file);
      return {
        default: response.url,
      };
    },
  });

  const customUploadAdapterPlugin = (editor: any) => {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) =>
      customUploadAdapter(loader);
  };

  return (
    <BDialog isOpen={isOpen} onClose={() => onClose(false)}>
      <div className="addNewsDialog">
        <p className="addNewsDialog__text addNewsDialog__text--title">
          {isEdit ? '編輯新聞' : '新增新聞'}
        </p>
        <div className="addNewsDialog__main">
          <FormInput
            name="title"
            control={control}
            label="標題"
            placeholder="輸入新聞標題"
          />
          <FormInput
            name="preview"
            control={control}
            label="摘要"
            placeholder="輸入新聞摘要"
          />
          <div className="form-group editor-container">
            <label className="form-label">內容</label>
            <CKEditor
              editor={ClassicEditor}
              data={watch('content')}
              config={{
                licenseKey:
                  'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NjU0OTc1OTksImp0aSI6ImM0MzMyMThmLWI4OWQtNDNmOS04OWVjLTcyN2Q5MGU2Y2YwMCIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiXSwiZmVhdHVyZXMiOlsiRFJVUCIsIkJPWCJdLCJ2YyI6IjgwNDQ4YjI3In0.-QZwe1h28C8klU4zFA3u5KWp6iyqjZCj_Om8hNChdwNqwowWf56Vhz69R3gqyKcAc_iHkCYmAucOoCQfBSTIvA',
                toolbar: [
                  'bold',
                  'italic',
                  'link',
                  'bulletedList',
                  'numberedList',
                ],
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                setValue('content', data);
              }}
            />
          </div>
          <div className="form-group">
            <label>上傳圖片</label>
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
          <FormSelect
            name="status"
            control={control}
            label="狀態"
            options={[
              { value: NewsStatus.AVAILABLE, label: '可用' },
              { value: NewsStatus.UNAVAILABLE, label: '不可用' },
            ]}
          />
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
