import { FC, useEffect, useState } from 'react';
import BDialog from './BDialog';
import MButton from '../MButton';
import { useForm } from 'react-hook-form';
import { FormSelect } from '../FormSelect';
import { FormInput } from '../FormInput';

import { useBackendDialog } from '@/context/backend/useBackendDialog';
import { useLoading } from '@/context/frontend/LoadingContext';
import { getAllCategories } from '@/services/backend/ProductService';

interface AddProductDialogProps {
  isOpen: boolean;
  onClose: (result: boolean) => void;
  onConfirm: () => void;
  isEdit?: boolean;
  product?: any;
}
enum PrizeCategory {
  FIGURE = 'FIGURE',
  C3 = 'C3',
  BONUS = 'BONUS',
  PRIZESELF = 'PRIZESELF',
  NONE = 'NONE',
}

const AddProductDialog: FC<AddProductDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isEdit = false,
  product,
}) => {
  const { openInfoDialog } = useBackendDialog();
  const { setLoading } = useLoading();
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState<any[]>([]);
  const [bannerImages, setBannerImages] = useState<any[]>([]);
  enum ProductType {
    PRIZE = 'PRIZE',
    GACHA = 'GACHA',
    BLIND_BOX = 'BLIND_BOX',
    CUSTMER_PRIZE = 'CUSTMER_PRIZE',
  }

  enum ProductStatus {
    AVAILABLE = 'AVAILABLE',
    UNAVAILABLE = 'UNAVAILABLE',
    NOT_AVAILABLE_YET = 'NOT_AVAILABLE_YET',
    SOLD_OUT = 'SOLD_OUT',
  }

  const productTypeOptions: Record<ProductType, string> = {
    [ProductType.PRIZE]: '一番賞',
    [ProductType.GACHA]: '扭蛋',
    [ProductType.BLIND_BOX]: '盲盒',
    [ProductType.CUSTMER_PRIZE]: '客製化抽獎',
  };

  const productStatusOptions: Record<ProductStatus, string> = {
    [ProductStatus.AVAILABLE]: '上架',
    [ProductStatus.UNAVAILABLE]: '下架',
    [ProductStatus.NOT_AVAILABLE_YET]: '上架大賞已售完',
    [ProductStatus.SOLD_OUT]: '上架已售完',
  };

  const prizeCategoryOptions = [
    { value: '', label: '請選擇' },
    { value: PrizeCategory.FIGURE, label: '官方一番賞' },
    { value: PrizeCategory.C3, label: '家電一番賞' },
    { value: PrizeCategory.BONUS, label: '紅利賞' },
    { value: PrizeCategory.PRIZESELF, label: '自製賞' },
    { value: PrizeCategory.NONE, label: '無' },
  ];

  const { control, reset, getValues } = useForm<any>({
    defaultValues: {
      productName: '',
      description: '',
      productType: '',
      prizeCategory: '',
      price: '',
      sliverPrice: '',
      bonusPrice: '',
      status: '',
      specification: '',
      selectedCategoryId: '',
      hasBanner: '',
    },
  });

  useEffect(() => {
    if (isEdit && product) {
      reset({
        productName: product.productName,
        description: product.description,
        price: product.price,
        stockQuantity: product.stockQuantity,
        width: product.width,
        height: product.height,
        length: product.length,
        specification: product.specification,
        specialPrice: product.specialPrice,
        details: product.details,
        status: product.status,
        categoryId: product.categoryId,
      });
      setImages(product.imageUrl || []);
    }
  }, [isEdit, product, reset]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();

        if (response.success) {
          setCategories(response.data.categories);
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

  const handleBannerFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setBannerImages((prev) => [...prev, ...files]);
    }
  };

  const removeBannerImage = (index: number) => {
    setBannerImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    console.log(getValues());

    // try {
    //   setLoading(true);
    //   const formData = new FormData();
    //   const productReq = {
    //     productName: getValues().productName,
    //     description: getValues().description,
    //     price: Number(getValues().price),
    //     stockQuantity: Number(getValues().stockQuantity),
    //     categoryId: getValues().categoryId,
    //     width: Number(getValues().width),
    //     height: Number(getValues().height),
    //     length: Number(getValues().length),
    //     specification: getValues().specification,
    //     shippingMethod: 'Express',
    //     specialPrice: Number(getValues().specialPrice),
    //     status: getValues().status,
    //     imageUrl: images.filter((img) => typeof img === 'string'),
    //     details: getValues().details,
    //     shippingPrice: 0,
    //     size: 0,
    //   };
    //   formData.append('productReq', JSON.stringify(productReq));
    //   const newImages = images.filter((img) => img instanceof File) as File[];
    //   newImages.forEach((file) => {
    //     formData.append('images', file, file.name);
    //   });
    //   let response;
    //   if (isEdit && product) {
    //     response = await updateproduct(product.productId, formData);
    //   } else {
    //     response = await addproduct(formData);
    //   }
    //   setLoading(false);
    //   if (response.success) {
    //     await openInfoDialog(
    //       '系統提示',
    //       isEdit ? '商品更新成功' : '商品新增成功'
    //     );
    //     onClose(true);
    //   } else {
    //     await openInfoDialog(
    //       '系統提示',
    //       response.message || '操作失敗，請稍後再試！'
    //     );
    //   }
    // } catch (error) {
    //   setLoading(false);
    //   console.error('操作失敗:', error);
    //   await openInfoDialog('系統提示', '操作過程中出現錯誤，請稍後再試！');
    // }
  };

  return (
    <BDialog isOpen={isOpen} onClose={() => onClose(false)}>
      <div className="addProductDialog">
        <p className="addProductDialog__text addProductDialog__text--title">
          {isEdit ? '編輯商品' : '新增商品'}
        </p>
        <div className="addProductDialog__main">
          <div className="flex">
            <div className="w-100">
              <p className="addMemberDialog__text">產品名稱:</p>
            </div>
            <FormInput name="productName" control={control} />
          </div>

          <div className="flex">
            <div className="w-100">
              <p className="addMemberDialog__text">描述:</p>
            </div>
            <FormInput name="description" control={control} />
          </div>
          <div className="flex">
            <div className="w-100">
              <p className="addMemberDialog__text">產品類型:</p>
            </div>
            <FormSelect
              name="productType"
              control={control}
              options={Object.entries(productTypeOptions).map(
                ([key, label]) => {
                  return { value: key, label };
                }
              )}
            />
          </div>
          <div className="flex">
            <div className="w-100">
              <p className="addMemberDialog__text">一番賞類別:</p>
            </div>
            <FormSelect
              name="prizeCategory"
              control={control}
              options={prizeCategoryOptions}
            />
          </div>

          <div className="flex">
            <div className="w-100">
              <p className="addMemberDialog__text">金幣價格:</p>
            </div>
            <FormInput name="price" control={control} />
          </div>
          <div className="flex">
            <div className="w-100">
              <p className="addMemberDialog__text">銀幣價格:</p>
            </div>
            <FormInput name="sliverPrice" control={control} />
          </div>
          <div className="flex">
            <div className="w-100">
              <p className="addMemberDialog__text">紅利價格:</p>
            </div>
            <FormInput name="bonusPrice" control={control} />
          </div>
          <div className="flex">
            <div className="w-100">
              <p className="addMemberDialog__text">狀態:</p>
            </div>
            <FormSelect
              name="status"
              control={control}
              options={Object.entries(productStatusOptions).map(
                ([key, label]) => {
                  return { value: key, label };
                }
              )}
            />
          </div>

          <div className="flex">
            <div className="w-100">
              <p className="addMemberDialog__text">規格:</p>
            </div>
            <FormInput name="specification" control={control} />
          </div>

          <div className="flex">
            <div className="w-100">
              <p className="addMemberDialog__text">商品類別:</p>
            </div>
            <FormSelect
              name="categorySelect"
              control={control}
              options={categories.map((cat) => ({
                value: cat.categoryId.toString(),
                label: cat.categoryName,
              }))}
            />
          </div>
          <div className="flex">
            <div className="w-100">
              <p className="addMemberDialog__text">選擇是否需要 Banner 圖片:</p>
            </div>
            <FormSelect
              name="hasBanner"
              control={control}
              options={[
                { value: true, label: '是' },
                { value: false, label: '否' },
              ]}
            />
          </div>

          <div className="flex">
            <div className="w-100">
              <p className="addMemberDialog__text">橫幅圖片:</p>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleBannerFileChange}
            />
            <div className="image-preview">
              {images.map((image, index) => (
                <div key={index} className="image-item">
                  {typeof image === 'string' ? (
                    <img src={image} alt="商品圖片" className="preview-image" />
                  ) : (
                    <p>{image.name}</p>
                  )}
                  <button
                    type="button"
                    onClick={() => removeBannerImage(index)}
                  >
                    移除
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex">
            <div className="w-100">
              <p className="addMemberDialog__text">商品圖片:</p>
            </div>
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
        <div className="addProductDialog__btns">
          <MButton text="取消" click={() => onClose(false)} />
          <MButton text={isEdit ? '更新' : '新增'} click={handleSubmit} />
        </div>
      </div>
    </BDialog>
  );
};

export default AddProductDialog;
