import { FC, useEffect } from 'react';
import BDialog from './BDialog';
import MButton from '../MButton';
import { useForm } from 'react-hook-form';
import { FormInput } from '../FormInput';
import { useBackendDialog } from '@/context/backend/useBackendDialog';
import { useLoading } from '@/context/frontend/LoadingContext';
import {
  createCategory,
  updateCategory,
} from '@/services/backend/ProductService';

interface AddProductCategoryDialogProps {
  isOpen: boolean;
  onClose: (result: boolean) => void;
  onConfirm: () => void;
  isEdit?: boolean;
  productCategory?: { categoryName: string; productSort: number; id: number };
}

const AddProductCategoryDialog: FC<AddProductCategoryDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isEdit = false,
  productCategory,
}) => {
  const { control, reset, getValues } = useForm({
    defaultValues: {
      categoryName: '',
      productSort: '',
    },
  });

  const { openInfoDialog } = useBackendDialog();
  const { setLoading } = useLoading();

  useEffect(() => {
    const defaultValues = {
      categoryName: productCategory?.categoryName || '',
      productSort: productCategory?.productSort || '',
    };
    reset(defaultValues);
  }, [productCategory, reset]);

  const validateForm = async () => {
    const { categoryName, productSort } = getValues();

    try {
      if (!categoryName.trim()) {
        throw new Error('類別名稱為必填項！');
      }
      if (!productSort || ~~productSort <= 0) {
        throw new Error('排序號碼必須為正數！');
      }
      return true;
    } catch (error) {
      if (error instanceof Error) {
        await openInfoDialog('系統提示', error.message);
      }
      return false;
    }
  };

  const handleSubmit = async () => {
    if (await validateForm()) {
      const formData = getValues();

      try {
        setLoading(true);
        const { success, message } = isEdit
          ? await updateCategory(productCategory?.categoryId || 0, formData)
          : await createCategory(formData);

        setLoading(false);

        if (success) {
          await openInfoDialog(
            '系統提示',
            isEdit ? '更新成功！' : '新增成功！'
          );
          onClose(true);
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
      <div className="addProductCategoryDialog">
        <p className="addProductCategoryDialog__text addProductCategoryDialog__text--title">
          {isEdit ? '編輯商品類別' : '新增商品類別'}
        </p>
        <div className="addProductCategoryDialog__main">
          <div className="flex">
            <div className="w-100">
              <p className="addProductCategoryDialog__text">類別名稱:</p>
            </div>
            <FormInput name="categoryName" control={control} />
          </div>

          <div className="flex">
            <div className="w-100">
              <p className="addProductCategoryDialog__text">排序號碼:</p>
            </div>
            <FormInput name="productSort" control={control} />
          </div>
        </div>
        <div className="addProductCategoryDialog__btns">
          <MButton
            text={'取消'}
            customClass="addProductCategoryDialog__btn"
            click={() => onClose(false)}
          />
          <MButton
            text={isEdit ? '儲存' : '新增'}
            customClass="addProductCategoryDialog__btn"
            click={handleSubmit}
          />
        </div>
      </div>
    </BDialog>
  );
};

export default AddProductCategoryDialog;
