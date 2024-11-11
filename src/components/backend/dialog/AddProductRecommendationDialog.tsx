import { FC, useEffect, useState } from 'react';
import BDialog from './BDialog';
import MButton from '../MButton';
import { useForm } from 'react-hook-form';
import { FormSelect } from '../FormSelect';
import { getAllProducts } from '@/services/backend/ProductService';
import { getAllStoreRecommendations } from '@/services/backend/RecommendationService';
import { getAllStoreProducts } from '@/services/backend/StoreServices';
import { ProductType } from '@/interfaces/product';

interface AddProductRecommendationDialogProps {
  isOpen: boolean;
  onClose: (result: boolean) => void;
  onConfirm: () => void;
  customClass?: string;
}

const AddProductRecommendationDialog: FC<
  AddProductRecommendationDialogProps
> = ({ isOpen, onClose, customClass }) => {
  const { control, watch, getValues } = useForm({
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

      const isGacha = storeProductRecommendationOptions.some(
        (option) =>
          option.value === selectedRecommendationId &&
          option.label === '扭蛋推薦'
      );

      try {
        let products = [];
        if (isGacha) {
          const { success, data } = await getAllProducts();
          if (success) {
            products =
              data.filter(
                (product) => product.productType === ProductType.GACHA
              ) || [];

            console.log(products);
          }
        } else {
          const { success, data } = await getAllStoreProducts();
          if (success) {
            products = data || [];
          }
        }

        if (products.length > 0) {
          const options = products.map((product: any) => ({
            value: isGacha ? product.productId : product.storeProductId,
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

  const handleSave = () => {
    console.log('Selected Values:', getValues());
    onClose(true);
  };

  return (
    <BDialog
      isOpen={isOpen}
      onClose={() => onClose(false)}
      className={customClass}
    >
      <div className="addProductRecommendationDialog">
        <p>新增推薦系列</p>
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
          <MButton
            text="取消"
            customClass="addProductRecommendationDialog__btn"
            click={() => onClose(false)}
          />
          <MButton
            text="儲存"
            customClass="addProductRecommendationDialog__btn"
            click={handleSave}
          />
        </div>
      </div>
    </BDialog>
  );
};

export default AddProductRecommendationDialog;
