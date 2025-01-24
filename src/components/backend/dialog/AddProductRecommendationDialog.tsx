import { FC, useEffect, useState } from 'react';
import BDialog from './BDialog';
import MButton from '../MButton';
import { useForm } from 'react-hook-form';
import { useBackendDialog } from '@/context/backend/useBackendDialog';
import { useLoading } from '@/context/frontend/LoadingContext';
import { getAllProducts } from '@/services/backend/ProductService';
import {
  createRecommendationMapping,
  getAllStoreRecommendations,
  updateRecommendationMapping,
} from '@/services/backend/RecommendationService';
import { getAllStoreProducts } from '@/services/backend/StoreServices';
import { FormSelect } from '../FormSelect';
import { ProductType } from './AddBannerDialog';

interface AddProductRecommendationDialogProps {
  isOpen: boolean;
  onClose: (result: boolean) => void;
  onConfirm: () => void;
  isEdit?: boolean;
  productRecommendation?: any;
  customClass?: string;
}

const AddProductRecommendationDialog: FC<
  AddProductRecommendationDialogProps
> = ({
  isOpen,
  onClose,
  onConfirm,
  isEdit = false,
  productRecommendation,
  customClass,
}) => {
  const { control, watch, getValues, reset } = useForm({
    defaultValues: {
      storeProductRecommendationId: '',
      storeProductId: '',
    },
  });

  const [
    storeProductRecommendationOptions,
    setStoreProductRecommendationOptions,
  ] = useState<{ value: string | number; label: string }[]>([
    { value: '', label: '請選擇' },
  ]);
  const [storeProductOptions, setStoreProductOptions] = useState<
    { value: string; label: string }[]
  >([{ value: '', label: '請選擇' }]);

  const selectedRecommendationId = watch('storeProductRecommendationId');

  const { openInfoDialog } = useBackendDialog();
  const { setLoading } = useLoading();

  useEffect(() => {
    const defaultValues = {
      storeProductRecommendationId: '',
      storeProductId: '',
    };

    if (isEdit && productRecommendation) {
      defaultValues.storeProductRecommendationId =
        productRecommendation.storeProductRecommendationId;
      defaultValues.storeProductId = productRecommendation.storeProductId;
    }
    reset(defaultValues);
  }, [isEdit, productRecommendation, reset]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const { success, data } = await getAllStoreRecommendations();
        if (success && data) {
          setStoreProductRecommendationOptions([
            { value: '', label: '請選擇' },
            ...data.map((recommendation) => ({
              value: recommendation.id,
              label: recommendation.recommendationName,
            })),
          ]);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };
    fetchRecommendations();
  }, []);
  useEffect(() => {
    const fetchProductsByType = async () => {
      if (!selectedRecommendationId) return;

      try {
        let products = [];

        const { success, data } = await getAllStoreProducts();
        if (success) {
          products = data || [];
        }

        if (products.length > 0) {
          const options = products.map((product: any) => ({
            value: product.storeProductId,
            label: product.productName,
          }));
          setStoreProductOptions([{ value: '', label: '請選擇' }, ...options]);
        } else {
          setStoreProductOptions([{ value: '', label: '請選擇' }]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProductsByType();
  }, [selectedRecommendationId, storeProductRecommendationOptions]);

  const validateForm = async () => {
    const { storeProductRecommendationId, storeProductId } = getValues();

    try {
      if (!storeProductRecommendationId) {
        throw new Error('請選擇推薦類別！');
      }

      if (!storeProductId) {
        throw new Error('請選擇產品！');
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
      const recommendationData = getValues();

      try {
        setLoading(true);
        const { success, message } = isEdit
          ? await updateRecommendationMapping(productRecommendation?.id, {
              storeProductRecommendationId:
                recommendationData.storeProductRecommendationId,
              storeProductId: recommendationData.storeProductId,
            })
          : await createRecommendationMapping({
              storeProductRecommendationId:
                recommendationData.storeProductRecommendationId,
              storeProductId: recommendationData.storeProductId,
            });

        setLoading(false);

        if (success) {
          await openInfoDialog(
            '系統提示',
            isEdit ? '推薦編輯成功！' : '推薦新增成功！'
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
      <div className="addProductRecommendationDialog">
        <p className="addProductRecommendationDialog__text addProductRecommendationDialog__text--title">
          {isEdit ? '編輯推薦系列' : '新增推薦系列'}
        </p>
        <div className="addProductRecommendationDialog__main">
          <div className="flex">
            <div className="w-100">
              <p className="addProductRecommendationDialog__text">選擇類別:</p>
              <FormSelect
                name="storeProductRecommendationId"
                control={control}
                options={storeProductRecommendationOptions}
              />
            </div>
          </div>
          <div className="flex">
            <div className="w-100">
              <p className="addProductRecommendationDialog__text">選擇產品:</p>
              <FormSelect
                name="storeProductId"
                control={control}
                options={storeProductOptions}
              />
            </div>
          </div>
        </div>
        <div className="addProductRecommendationDialog__btns">
          <MButton text={'取消'} click={() => onClose(false)} />
          <MButton text={isEdit ? '儲存' : '新增'} click={handleSubmit} />
        </div>
      </div>
    </BDialog>
  );
};

export default AddProductRecommendationDialog;
