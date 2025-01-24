import { FC, useEffect, useState } from 'react';
import BDialog from './BDialog';
import MButton from '../MButton';
import { useForm } from 'react-hook-form';
import { FormInput } from '../FormInput';
import { FormSelect } from '../FormSelect';
import { useBackendDialog } from '@/context/backend/useBackendDialog';
import { useLoading } from '@/context/frontend/LoadingContext';
import {
  createProductDetail2,
  updateProductDetail2,
  uploadProductDetailImg,
} from '@/services/backend/ProductService';
import { getImageUrl } from '@/utils/ImageUtils';

interface AddProductDetailDialogProps {
  isOpen: boolean;
  onClose: (result: boolean) => void;
  isEdit?: boolean;
  productId: any;
  productDetail?: any;
}

const AddProductDetailDialog: FC<AddProductDetailDialogProps> = ({
  isOpen,
  onClose,
  isEdit = false,
  productId,
  productDetail,
}) => {
  const gradeOptions = [
    { value: 'SP', label: 'SP' },
    { value: 'LAST', label: 'LAST' },
    { value: 'A', label: 'A' },
    { value: 'B', label: 'B' },
    { value: 'C', label: 'C' },
    { value: 'D', label: 'D' },
    { value: 'E', label: 'E' },
    { value: 'F', label: 'F' },
    { value: 'G', label: 'G' },
    { value: 'H', label: 'H' },
    { value: 'I', label: 'I' },
    { value: 'J', label: 'J' },
    { value: 'K', label: 'K' },
    { value: 'L', label: 'L' },
    { value: 'M', label: 'M' },
    { value: 'N', label: 'N' },
    { value: 'O', label: 'O' },
    { value: 'P', label: 'P' },
    { value: 'Q', label: 'Q' },
    { value: 'R', label: 'R' },
    { value: 'S', label: 'S' },
    { value: 'T', label: 'T' },
    { value: 'U', label: 'U' },
    { value: 'V', label: 'V' },
    { value: 'W', label: 'W' },
    { value: 'X', label: 'X' },
    { value: 'Y', label: 'Y' },
    { value: 'Z', label: 'Z' },
  ];

  const sizeOptions = [
    { value: '10', label: '10' },
    { value: '20', label: '20' },
    { value: '30', label: '30' },
    { value: '40', label: '40' },
    { value: '50', label: '50' },
    { value: '60', label: '60' },
    { value: '70', label: '70' },
    { value: '80', label: '80' },
    { value: '90', label: '90' },
    { value: '100', label: '100' },
    { value: '110', label: '110' },
    { value: '120', label: '120' },
    { value: '130', label: '130' },
    { value: '140', label: '140' },
    { value: '150', label: '150' },
    { value: '160', label: '160' },
    { value: '170', label: '170' },
    { value: '180', label: '180' },
    { value: '190', label: '190' },
    { value: '200', label: '200' },
  ];
  const [images, setImages] = useState<any[]>([]);
  const { control, reset, handleSubmit, getValues } = useForm({
    defaultValues: {
      productName: '',
      description: '',
      note: '',
      quantity: 0,
      grade: 'A',
      sliverPrice: '',
      specification: '',
      size: '',
      probability: '',
      isPrize: false,
    },
  });

  const { openInfoDialog } = useBackendDialog();
  const { setLoading } = useLoading();

  useEffect(() => {
    if (productDetail) {
      reset({
        productName: productDetail.productName || '',
        description: productDetail.description || '',
        note: productDetail.note || '',
        quantity: productDetail.quantity || 0,
        grade: productDetail.grade || '',
        sliverPrice: productDetail.sliverPrice || '',
        specification: productDetail.specification || '',
        size: productDetail.size || '',
        probability: productDetail.probability || '',
        isPrize: productDetail.isPrize || false,
      });
      setImages(productDetail.imageUrls || []);
    }
  }, [productDetail, reset]);

  const validateForm = async () => {
    const {
      productName,
      quantity,
      sliverPrice,
      probability,
      specification,
      size,
    } = getValues();

    try {
      if (!productName.trim()) {
        throw new Error('商品名稱為必填項！');
      }

      if (
        quantity === undefined ||
        isNaN(Number(quantity)) ||
        Number(quantity) <= 0
      ) {
        throw new Error('數量必須為正數！');
      }

      if (
        sliverPrice === undefined ||
        isNaN(Number(sliverPrice)) ||
        Number(sliverPrice) <= 0
      ) {
        throw new Error('銀幣價格必須為正數！');
      }

      if (!specification.trim()) {
        throw new Error('規格為必填項！');
      }

      if (!size) {
        throw new Error('尺寸為必填項！');
      }

      if (
        probability === undefined ||
        probability === '' ||
        isNaN(Number(probability)) ||
        Number(probability) < 0.0001 ||
        Number(probability) > 0.9999
      ) {
        throw new Error('機率必須為介於 0.0001 和 0.9999 之間的有效數字！');
      }
      return true;
    } catch (error) {
      if (error instanceof Error) {
        await openInfoDialog('系統提示', error.message);
      }
      return false;
    }
  };

  const handleFormSubmit = async () => {
    const values = getValues();
    if (await validateForm()) {
      try {
        setLoading(true);
        const { success, message, data } = isEdit
          ? await updateProductDetail2({
              productDetailId: productDetail.productDetailId,
              productId: productId,
              ...values,
            })
          : await createProductDetail2({
              productId: productId,
              ...values,
            });

        setLoading(false);

        if (!success) {
          await openInfoDialog('系統提示', message || '產品創建失敗');
          return;
        }

        const productDetailId = isEdit
          ? productDetail.productDetailId
          : data.productDetailId;
        setLoading(true);

        try {
          await uploadProductDetailImg(images, productDetailId);
        } catch (error) {
          console.error('上傳產品圖片失敗:', error);
        }

        setLoading(false);
        await openInfoDialog('系統提示', isEdit ? '更新成功！' : '新增成功！');
        onClose(true);
      } catch (error) {
        setLoading(false);
        console.error('操作失敗:', error);
        await openInfoDialog('系統提示', '操作過程中出現錯誤，請稍後再試！');
      }
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setImages([event.target.files[0]]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };
  return (
    <BDialog
      isOpen={isOpen}
      onClose={() => onClose(false)}
      mainClassName="max-w-640"
    >
      <div className="addProductDetailDialog">
        <p className="addProductDetailDialog__text addProductDetailDialog__text--title">
          {isEdit ? '編輯商品' : '新增商品'}
        </p>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="addProductDetailDialog__main">
            <div className="flex">
              <div className="w-100">
                <p className="addProductDetailDialog__text">商品名稱:</p>
              </div>
              <FormInput name="productName" control={control} />
            </div>

            <div className="flex">
              <div className="w-100">
                <p className="addProductDetailDialog__text">數量:</p>
              </div>
              <FormInput
                name="quantity"
                control={control}
                type="number"
                required
              />
            </div>

            <div className="flex">
              <div className="w-100">
                <p className="addProductDetailDialog__text">等級:</p>
              </div>
              <FormSelect
                name="grade"
                control={control}
                options={gradeOptions}
              />
            </div>

            <div className="flex">
              <div className="w-100">
                <p className="addProductDetailDialog__text">銀幣價格:</p>
              </div>
              <FormInput name="sliverPrice" control={control} type="number" />
            </div>

            <div className="flex">
              <div className="w-100">
                <p className="addProductDetailDialog__text">規格:</p>
              </div>
              <FormInput name="specification" control={control} />
            </div>

            <div className="flex">
              <div className="w-100">
                <p className="addProductDetailDialog__text">尺寸:</p>
              </div>
              <FormSelect name="size" control={control} options={sizeOptions} />
            </div>

            <div className="flex">
              <div className="w-100">
                <p className="addProductDetailDialog__text">機率:</p>
              </div>
              <FormInput
                name="probability"
                control={control}
                type="number"
                step="0.0001"
                min="0.0001"
                max="0.9999"
              />
            </div>

            <div className="flex">
              <div className="w-100">
                <p className="addProductDetailDialog__text">是否為大獎:</p>
              </div>
              <input type="checkbox" {...control.register('isPrize')} />
            </div>

            <div className="flex">
              <div className="w-100">
                <p className="addProductDetailDialog__text">商品圖片:</p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>

            <div className="image-preview">
              {images.map((image, index) => (
                <div key={index} className="image-item">
                  {typeof image === 'string' ? (
                    <img
                      src={getImageUrl(image)}
                      alt="商品圖片"
                      className="preview-image"
                      width={40}
                      height={40}
                    />
                  ) : (
                    <p>{image.name}</p>
                  )}
                  <button type="button" onClick={() => removeImage(index)}>
                    移除
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="addProductDetailDialog__btns">
            <MButton
              text={'取消'}
              customClass="addProductDetailDialog__btn"
              click={() => onClose(false)}
            />
            <MButton
              text={isEdit ? '儲存' : '新增'}
              customClass="addProductDetailDialog__btn"
              click={handleSubmit(handleFormSubmit)}
            />
          </div>
        </form>
      </div>
    </BDialog>
  );
};

export default AddProductDetailDialog;
