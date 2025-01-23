import { FC, useEffect, useState } from 'react';
import BDialog from './BDialog';
import MButton from '../MButton';
import { useForm } from 'react-hook-form';
import { FormSelect } from '../FormSelect';
import { FormInput } from '../FormInput';
import { createUser, updateUser } from '@/services/backend/UserService';
import { getAllProductsByType } from '@/services/backend/ProductService';
import { generateRedemptionCode } from '@/services/backend/RedemptionService';
import { useBackendDialog } from '@/context/backend/useBackendDialog';
import { useLoading } from '@/context/frontend/LoadingContext';

interface AddRedemptionCodeDialogProps {
  isOpen: boolean;
  onClose: (result: boolean) => void;
  onConfirm: () => void;
  isEdit?: boolean;
  member?: any;
  customClass?: string;
}

const AddRedemptionCodeDialog: FC<AddRedemptionCodeDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isEdit = false,
  member,
  customClass,
}) => {
  const { control, watch, reset, getValues } = useForm({
    defaultValues: {
      productId: '',
      codeCount: '',
    },
  });

  const [products, setProducts] = useState<any[]>([]);

  const { openInfoDialog } = useBackendDialog();
  const { setLoading } = useLoading();

  const fetchProductList = async () => {
    try {
      const { success, data, message } = await getAllProductsByType(
        'CUSTMER_PRIZE'
      );
      if (success) {
        const filteredProducts = data.filter((product) =>
          ['AVAILABLE', 'NOT_AVAILABLE_YET'].includes(product.status)
        );
        setProducts(filteredProducts);
      } else {
        console.error('Error fetching products:', message);
      }
    } catch (error) {
      console.error('Failed to fetch product list:', error);
    }
  };

  useEffect(() => {
    fetchProductList();
  }, []);

  const validateForm = () => {
    const { productId, codeCount } = getValues();
    try {
      if (!productId) {
        throw new Error('請選擇一個產品！');
      }

      if (~~codeCount < 1) {
        throw new Error('生成數量必須至少為 1！');
      }
    } catch (error) {
      if (error instanceof Error) {
        openInfoDialog('系統提示', error.message);
      } else {
        openInfoDialog('系統提示', '未知錯誤，請稍後再試！');
      }
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const { productId, codeCount } = getValues();

      try {
        setLoading(true);
        const { success, data, code, message } = await generateRedemptionCode(
          productId,
          codeCount
        );

        setLoading(false);
        if (success) {
          await openInfoDialog('系統提示', '兌換碼生成成功！');
          onConfirm();
        } else {
          const errorMessage = message || '生成兌換碼失敗，請稍後再試！';
          await openInfoDialog('系統提示', errorMessage);
        }
      } catch (error) {
        setLoading(false);
        console.error('生成兌換碼失敗:', error);
        await openInfoDialog(
          '系統提示',
          '生成兌換碼過程中出現錯誤，請稍後再試！'
        );
      }
    }
  };

  return (
    <BDialog
      isOpen={isOpen}
      onClose={() => onClose(false)}
      mainClassName="max-w-640"
    >
      <div className="addRedemptionCodeDialog">
        <p className="addRedemptionCodeDialog__text addRedemptionCodeDialog__text--title">
          選擇產品生成兌換碼
        </p>
        <div className="addRedemptionCodeDialog__main">
          <div className="flex">
            <div className="w-100">
              <p className="addRedemptionCodeDialog__text">請選擇產品:</p>
            </div>
            <FormSelect
              name="productId"
              control={control}
              options={products.map((product: any) => ({
                value: product.productId,
                label: product.productName,
              }))}
              placeholder="選擇產品"
              rules={{
                required: '請選擇一個產品',
              }}
            />
          </div>

          <div className="flex">
            <div className="w-100">
              <p className="addRedemptionCodeDialog__text">生成數量:</p>
            </div>
            <FormInput
              name="codeCount"
              control={control}
              type="number"
              placeholder="輸入生成數量"
            />
          </div>
        </div>
        <div className="addRedemptionCodeDialog__btns">
          <MButton text={'取消'} click={() => onClose(false)} />
          <MButton text={isEdit ? '儲存' : '新增'} click={handleSubmit} />
        </div>
      </div>
    </BDialog>
  );
};

export default AddRedemptionCodeDialog;
