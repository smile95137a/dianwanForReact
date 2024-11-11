import { FC, useEffect, useState } from 'react';
import BDialog from './BDialog';
import MButton from '../MButton';
import { useForm } from 'react-hook-form';
import { FormSelect } from '../FormSelect';
import { getAllProductsByType } from '@/services/backend/ProductService';

interface AddBannerDialogProps {
  isOpen: boolean;
  onClose: (result: boolean) => void;
  onConfirm: () => void;
  customClass?: string;
}

export enum ProductStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
  NOT_AVAILABLE_YET = 'NOT_AVAILABLE_YET',
  SOLD_OUT = 'SOLD_OUT',
}

export enum ProductType {
  PRIZE = 'PRIZE',
  GACHA = 'GACHA',
  BLIND_BOX = 'BLIND_BOX',
  CUSTMER_PRIZE = 'CUSTMER_PRIZE',
}

export enum PrizeCategory {
  FIGURE = 'FIGURE',
  C3 = 'C3',
  BONUS = 'BONUS',
  PRIZESELF = 'PRIZESELF',
  NONE = 'NONE',
}

export enum BannerStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
}

const AddBannerDialog: FC<AddBannerDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  customClass,
}) => {
  const { control, watch, reset, getValues } = useForm({
    defaultValues: {
      productType: '',
      prizeCategory: '',
      productId: '',
      status: '',
    },
  });

  const [productOptions, setProductOptions] = useState<
    { value: string; label: string }[]
  >([{ value: '', label: '請選擇' }]);
  const selectedProductType = watch('productType');

  useEffect(() => {
    const fetchAvailableProducts = async () => {
      if (!selectedProductType) {
        setProductOptions([{ value: '', label: '請選擇' }]); // Reset product options if no type is selected
        return;
      }

      try {
        const { success, data } = await getAllProductsByType(
          selectedProductType
        );
        if (success) {
          setProductOptions([
            { value: '', label: '請選擇' },
            ...data.map((product) => ({
              value: product.productId,
              label: product.productName,
            })),
          ]);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      }
    };

    fetchAvailableProducts();
  }, [selectedProductType]);

  const addBanner = async () => {
    console.log(getValues());
    onClose(true);
  };

  const productTypeOptions = [
    { value: '', label: '請選擇' },
    { value: ProductType.PRIZE, label: '一番賞' },
    { value: ProductType.GACHA, label: '扭蛋' },
    { value: ProductType.BLIND_BOX, label: '盲盒' },
    { value: ProductType.CUSTMER_PRIZE, label: '自製獎品' },
  ];

  const prizeCategoryOptions = [
    { value: '', label: '請選擇' },
    { value: PrizeCategory.FIGURE, label: '官方一番賞' },
    { value: PrizeCategory.C3, label: '家電一番賞' },
    { value: PrizeCategory.BONUS, label: '紅利賞' },
    { value: PrizeCategory.PRIZESELF, label: '自製賞' },
    { value: PrizeCategory.NONE, label: '無' },
  ];

  const statusOptions = [
    { value: '', label: '請選擇' },
    { value: BannerStatus.AVAILABLE, label: '啟用' },
    { value: BannerStatus.UNAVAILABLE, label: '停用' },
  ];

  return (
    <BDialog
      isOpen={isOpen}
      onClose={() => onClose(false)}
      className={customClass}
    >
      <div className="addBannerDialog">
        <p>新增 Banner</p>
        <div className="addBannerDialog__main">
          <div className="flex">
            <div className="w-100">
              <p className="addBannerDialog__text">產品類型:</p>
              <FormSelect
                name="productType"
                control={control}
                options={productTypeOptions}
              />
            </div>
          </div>

          <div className="flex">
            <div className="w-100">
              <p className="addBannerDialog__text">獎品類別:</p>
              <FormSelect
                name="prizeCategory"
                control={control}
                options={prizeCategoryOptions}
              />
            </div>
          </div>

          <div className="flex">
            <div className="w-100">
              <p className="addBannerDialog__text">產品:</p>
              <FormSelect
                name="productId"
                control={control}
                options={productOptions}
              />
            </div>
          </div>

          <div className="flex">
            <div className="w-100">
              <p className="addBannerDialog__text">狀態:</p>
              <FormSelect
                name="status"
                control={control}
                options={statusOptions}
              />
            </div>
          </div>
        </div>
        <div className="addBannerDialog__btns">
          <MButton
            text={'取消'}
            customClass="addBannerDialog__btn"
            click={() => onClose(false)}
          />
          <MButton
            text={'儲存'}
            customClass="addBannerDialog__btn"
            click={addBanner}
          />
        </div>
      </div>
    </BDialog>
  );
};

export default AddBannerDialog;
