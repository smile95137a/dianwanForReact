import { FC, useEffect, useState } from 'react';
import BDialog from './BDialog';
import MButton from '../MButton';
import { useForm } from 'react-hook-form';
import { FormSelect } from '../FormSelect';
import { getAllProductsByType } from '@/services/backend/ProductService';
import { useBackendDialog } from '@/context/backend/useBackendDialog';
import { useLoading } from '@/context/frontend/LoadingContext';
import { createBanner } from '@/services/backend/BannerService';

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
  const { openInfoDialog } = useBackendDialog();
  const { setLoading } = useLoading();

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
          console.log(data);

          setProductOptions([
            { value: '', label: '請選擇' },
            ...data
              .filter((x) => x.status === 'AVAILABLE')
              .map((product) => ({
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

  const validateForm = () => {
    const { productId, status, productType } = getValues();
    try {
      if (!productId) {
        throw new Error('請選擇一個產品！');
      }

      if (!status) {
        throw new Error('請選擇 Banner 的狀態！');
      }

      if (!productType) {
        throw new Error('請選擇產品類型！');
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
      const bannerData = {
        productId: getValues('productId'),
        status: getValues('status'),
        productType: getValues('productType'),
      };

      try {
        setLoading(true);
        const { success, data, code, message } = await createBanner(bannerData);
        setLoading(false);
        if (success) {
          await openInfoDialog('系統提示', 'Banner 創建成功！');
          onClose(true);
        } else {
          const errorMessage = message || 'Banner 創建失敗，請稍後再試！';
          await openInfoDialog('系統提示', errorMessage);
        }
      } catch (error) {
        setLoading(false);
        console.error('Banner 創建失敗:', error);
        await openInfoDialog(
          '系統提示',
          '創建 Banner 過程中出現錯誤，請稍後再試！'
        );
      }
    }
  };

  const productTypeOptions = [
    { value: '', label: '請選擇' },
    { value: ProductType.PRIZE, label: '一番賞' },
    { value: ProductType.CUSTMER_PRIZE, label: '優惠賞' },
  ];

  const prizeCategoryOptions = [
    { value: '', label: '請選擇' },
    { value: PrizeCategory.FIGURE, label: '官方電玩賞' },
    { value: PrizeCategory.C3, label: '3C賞' },
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
      customClassName={customClass}
      mainClassName="max-w-640"
    >
      <div className="addBannerDialog">
        <p className="addBannerDialog__text addBannerDialog__text--title">
          新增 Banner
        </p>
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
          <MButton text={'取消'} click={() => onClose(false)} />
          <MButton text={'儲存'} click={handleSubmit} />
        </div>
      </div>
    </BDialog>
  );
};

export default AddBannerDialog;
