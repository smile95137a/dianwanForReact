import { FC, useEffect, useState } from 'react';
import BDialog from './BDialog';
import MButton from '../MButton';
import { useForm } from 'react-hook-form';
import { FormSelect } from '../FormSelect';
import { FormInput } from '../FormInput';
import {
  addStoreProduct,
  getAllCategories,
  updateStoreProduct,
} from '@/services/backend/StoreServices';
import { useBackendDialog } from '@/context/backend/useBackendDialog';
import { useLoading } from '@/context/frontend/LoadingContext';

interface AddStoreProductDialogProps {
  isOpen: boolean;
  onClose: (result: boolean) => void;
  onConfirm: () => void;
  isEdit?: boolean;
  storeProduct?: any;
}

const AddStoreProductDialog: FC<AddStoreProductDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isEdit = false,
  storeProduct,
}) => {
  const { openInfoDialog } = useBackendDialog();
  const { setLoading } = useLoading();
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState<any[]>([]);
  const { control, watch, reset, getValues } = useForm<any>({
    defaultValues: {
      productName: '',
      description: '',
      price: '',
      stockQuantity: '',
      width: '',
      height: '',
      length: '',
      specification: '',
      specialPrice: '',
      details: '',
      status: '',
      categoryId: '',
      imageUrl: [],
    },
  });

  useEffect(() => {
    if (isEdit && storeProduct) {
      reset({
        productName: storeProduct.productName,
        description: storeProduct.description,
        price: storeProduct.price,
        stockQuantity: storeProduct.stockQuantity,
        width: storeProduct.width,
        height: storeProduct.height,
        length: storeProduct.length,
        specification: storeProduct.specification,
        specialPrice: storeProduct.specialPrice,
        details: storeProduct.details,
        status: storeProduct.status,
        categoryId: storeProduct.categoryId,
        imageUrl: storeProduct.imageUrl || [],
      });
      setImages(storeProduct.imageUrl || []);
    }
  }, [isEdit, storeProduct, reset]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        if (response.success && Array.isArray(response.data)) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setImages((prev) => [...prev, ...files]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();

      const productReq = {
        productName: getValues().productName,
        description: getValues().description,
        price: Number(getValues().price),
        stockQuantity: Number(getValues().stockQuantity),
        categoryId: getValues().categoryId,
        width: Number(getValues().width),
        height: Number(getValues().height),
        length: Number(getValues().length),
        specification: getValues().specification,
        shippingMethod: 'Express',
        specialPrice: Number(getValues().specialPrice),
        status: getValues().status,
        imageUrl: images.filter((img) => typeof img === 'string'),
        details: getValues().details,
        shippingPrice: 0,
        size: 0,
      };

      formData.append('productReq', JSON.stringify(productReq));

      const newImages = images.filter((img) => img instanceof File) as File[];
      newImages.forEach((file) => {
        formData.append('images', file, file.name);
      });

      let response;
      if (isEdit && storeProduct) {
        response = await updateStoreProduct(
          storeProduct.storeProductId,
          formData
        );
      } else {
        response = await addStoreProduct(formData);
      }
      setLoading(false);
      if (response.success) {
        await openInfoDialog(
          '系統提示',
          isEdit ? '商品更新成功' : '商品新增成功'
        );
        onClose(true);
      } else {
        await openInfoDialog(
          '系統提示',
          response.message || '操作失敗，請稍後再試！'
        );
      }
    } catch (error) {
      setLoading(false);
      console.error('操作失敗:', error);
      await openInfoDialog('系統提示', '操作過程中出現錯誤，請稍後再試！');
    }
  };

  return (
    <BDialog isOpen={isOpen} onClose={() => onClose(false)}>
      <div className="addStoreProductDialog">
        <p className="addStoreProductDialog__text addStoreProductDialog__text--title">
          {isEdit ? '編輯商品' : '新增商品'}
        </p>
        <div className="addStoreProductDialog__main">
          <div className="flex">
            <div className="w-100">
              <p className="addStoreProductDialog__text">商品名稱:</p>
            </div>
            <FormInput name="productName" control={control} />
          </div>
          <div className="flex">
            <div className="w-100">
              <p className="addStoreProductDialog__text">商品描述:</p>
            </div>
            <FormInput name="description" control={control} as="textarea" />
          </div>
          <div className="flex">
            <div className="w-100">
              <p className="addStoreProductDialog__text">價格:</p>
            </div>
            <FormInput
              name="price"
              control={control}
              type="number"
              min={0}
              step={0.01}
            />
          </div>
          <div className="flex">
            <div className="w-100">
              <p className="addStoreProductDialog__text">數量:</p>
            </div>
            <FormInput
              name="stockQuantity"
              control={control}
              type="number"
              min={0}
              step={1}
            />
          </div>
          <div className="flex">
            <div className="w-100">
              <p className="addStoreProductDialog__text">寬度:</p>
            </div>
            <FormInput
              name="width"
              control={control}
              type="number"
              min={0}
              step={0.1}
            />
          </div>
          <div className="flex">
            <div className="w-100">
              <p className="addStoreProductDialog__text">高度:</p>
            </div>
            <FormInput
              name="height"
              control={control}
              type="number"
              min={0}
              step={0.1}
            />
          </div>
          <div className="flex">
            <div className="w-100">
              <p className="addStoreProductDialog__text">深度:</p>
            </div>
            <FormInput
              name="length"
              control={control}
              type="number"
              min={0}
              step={0.1}
            />
          </div>
          <div className="flex">
            <div className="w-100">
              <p className="addStoreProductDialog__text">規格:</p>
            </div>
            <FormInput name="specification" control={control} />
          </div>
          <div className="flex">
            <div className="w-100">
              <p className="addStoreProductDialog__text">特價:</p>
            </div>
            <FormInput
              name="specialPrice"
              control={control}
              type="number"
              min={0}
              step={0.01}
            />
          </div>
          <div className="flex">
            <div className="w-100">
              <p className="addStoreProductDialog__text">商品詳情:</p>
            </div>
            <FormInput name="details" control={control} as="textarea" />
          </div>
          <div className="flex">
            <div className="w-100">
              <p className="addStoreProductDialog__text">狀態:</p>
            </div>
            <FormSelect
              name="status"
              control={control}
              options={[
                { value: 'AVAILABLE', label: '上架' },
                { value: 'UNAVAILABLE', label: '未上架' },
              ]}
            />
          </div>
          <div className="flex">
            <div className="w-100">
              <p className="addStoreProductDialog__text">類別:</p>
            </div>
            <FormSelect
              name="categoryId"
              control={control}
              options={categories.map((cat) => ({
                value: cat.categoryId.toString(),
                label: cat.categoryName,
              }))}
            />
          </div>
          <div className="form-group">
            <label>商品圖片</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />
            <div className="image-preview">
              {images.map((image, index) => (
                <div key={index} className="image-item">
                  {typeof image === 'string' ? (
                    <img src={image} alt="商品圖片" className="preview-image" />
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
        </div>
        <div className="addStoreProductDialog__btns">
          <MButton
            text={'取消'}
            customClass="addStoreProductDialog__btn"
            click={() => onClose(false)}
          />
          <MButton
            text={isEdit ? '更新' : '新增'}
            customClass="addStoreProductDialog__btn"
            click={handleSubmit}
          />
        </div>
      </div>
    </BDialog>
  );
};

export default AddStoreProductDialog;
