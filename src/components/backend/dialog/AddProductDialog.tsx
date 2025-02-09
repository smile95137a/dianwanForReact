import { FC, useEffect, useState } from 'react';
import BDialog from './BDialog';
import MButton from '../MButton';
import { useForm } from 'react-hook-form';
import { FormSelect } from '../FormSelect';
import { FormInput } from '../FormInput';

import { useBackendDialog } from '@/context/backend/useBackendDialog';
import { useLoading } from '@/context/frontend/LoadingContext';
import {
  createProduct2,
  getAllCategories,
  updateProduct2,
  uploadProductBannerImg,
  uploadProductImg,
} from '@/services/backend/ProductService';
import { getImageUrl } from '@/utils/ImageUtils';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CustomUploadAdapterPlugin from './CustomeUoload';
const editorConfig = {
  licenseKey: 'GPL',
  toolbar: [
    'heading',
    '|',
    'bold',
    'italic',
    'link',
    'bulletedList',
    'numberedList',
    'blockQuote',
    '|',
    'uploadImage',
    'undo',
    'redo',
  ],
  image: {
    toolbar: ['imageTextAlternative', 'imageStyle:full', 'imageStyle:side'],
  },
  extraPlugins: [CustomUploadAdapterPlugin],
};

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
    [ProductType.CUSTMER_PRIZE]: '集單賞',
  };

  const productStatusOptions: Record<ProductStatus, string> = {
    [ProductStatus.AVAILABLE]: '上架',
    [ProductStatus.UNAVAILABLE]: '下架',
    [ProductStatus.NOT_AVAILABLE_YET]: '上架大賞已售完',
    [ProductStatus.SOLD_OUT]: '上架已售完',
  };

  const prizeCategoryOptions = [
    { value: '', label: '請選擇' },
    { value: PrizeCategory.FIGURE, label: '官方電玩賞' },
    { value: PrizeCategory.C3, label: '3C賞' },
    { value: PrizeCategory.BONUS, label: '紅利賞' },
    { value: PrizeCategory.NONE, label: '無' },
  ];

  const { control, reset, getValues, watch, setValue } = useForm<any>({
    defaultValues: {
      productName: '',
      description: '',
      productType: ProductType.PRIZE,
      prizeCategory: '',
      price: '',
      sliverPrice: '',
      stockQuantity: 0,
      bonusPrice: '',
      status: ProductStatus.UNAVAILABLE,
      specification: '',
      categoryId: '',
      hasBanner: '',
    },
  });

  useEffect(() => {
    if (isEdit && product) {
      reset({
        productName: product.productName || '',
        description: product.description || '',
        productType: product.productType || ProductType.PRIZE,
        prizeCategory: product.prizeCategory || '',
        price: product.price || '',
        sliverPrice: product.sliverPrice || '',
        stockQuantity: product.stockQuantity || 0,
        bonusPrice: product.bonusPrice || '',
        status: product.status || ProductStatus.UNAVAILABLE,
        specification: product.specification || '',
        categoryId: product.categoryId || '',
        hasBanner: product.hasBanner || '',
      });
      setImages(product.imageUrls || []);
      setBannerImages(product.bannerImageUrl || []);
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
    if (event.target.files && event.target.files.length > 0) {
      setImages([event.target.files[0]]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBannerFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      setBannerImages([event.target.files[0]]); // 僅上傳單一橫幅圖片
    }
  };

  const removeBannerImage = (index: number) => {
    setBannerImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = async () => {
    const {
      productName,
      description,
      productType,
      prizeCategory,
      price,
      sliverPrice,
      bonusPrice,
      stockQuantity,
      status,
      categoryId,
      specification,
    } = getValues();

    try {
      if (!productName.trim()) {
        throw new Error('產品名稱為必填項！');
      }
      if (!description.trim()) {
        throw new Error('描述為必填項！');
      }
      if (!productType) {
        throw new Error('產品類型為必填項！');
      }
      if (!prizeCategory) {
        throw new Error('電玩賞類別為必填項！');
      }

      if (!specification.trim()) {
        throw new Error('規格為必填項！');
      }
      if (prizeCategory === PrizeCategory.BONUS) {
        if (
          bonusPrice === '' ||
          isNaN(Number(bonusPrice)) ||
          Number(bonusPrice) < 0
        ) {
          throw new Error('紅利價格必須為非負數字！');
        }
      } else {
        if (price === '' || isNaN(Number(price)) || Number(price) < 0) {
          throw new Error('金幣價格必須為非負數字！');
        }
        if (
          sliverPrice === '' ||
          isNaN(Number(sliverPrice)) ||
          Number(sliverPrice) < 0
        ) {
          throw new Error('點數價格必須為非負數字！');
        }
      }

      if (
        stockQuantity === '' ||
        isNaN(Number(stockQuantity)) ||
        Number(stockQuantity) < 0
      ) {
        throw new Error('庫存必須為非負數字！');
      }
      if (!status) {
        throw new Error('狀態為必填項！');
      }
      if (watch('productType') !== ProductType.GACHA && !categoryId) {
        throw new Error('商品類別為必填項！');
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
    const values = getValues();
    if (await validateForm()) {
      try {
        setLoading(true);

        const { success, data, message } = isEdit
          ? await updateProduct2({ productId: product.productId, ...values })
          : await createProduct2(values);

        if (!success) {
          setLoading(false);
          await openInfoDialog('系統提示', message || '產品創建失敗');
          return;
        }

        const productId = isEdit ? product.productId : data.productId;

        try {
          await uploadProductImg(images, productId);
        } catch (error) {
          console.error('上傳產品圖片失敗:', error);
        }

        try {
          await uploadProductBannerImg(bannerImages, productId);
        } catch (error) {
          console.error('上傳產品橫幅圖片失敗:', error);
        }

        setLoading(false);
        await openInfoDialog('系統提示', isEdit ? '更新成功！' : '新增成功！');
        onConfirm();
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

          <div className="flex flex-wrap">
            <div className="w-100">
              <p className="addMemberDialog__text">描述:</p>
            </div>
            <div className="w-100 editor-container">
              <CKEditor
                editor={ClassicEditor}
                config={editorConfig}
                data={watch('description')}
                onChange={(_, editor) => {
                  const data = editor.getData();
                  setValue('description', data);
                }}
              />
            </div>
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
              <p className="addMemberDialog__text">電玩賞類別:</p>
            </div>
            <FormSelect
              name="prizeCategory"
              control={control}
              options={prizeCategoryOptions}
            />
          </div>
          {watch('prizeCategory') !== PrizeCategory.BONUS && (
            <>
              <div className="flex">
                <div className="w-100">
                  <p className="addMemberDialog__text">金幣價格:</p>
                </div>
                <FormInput name="price" control={control} />
              </div>
              <div className="flex">
                <div className="w-100">
                  <p className="addMemberDialog__text">點數價格:</p>
                </div>
                <FormInput name="sliverPrice" control={control} />
              </div>
            </>
          )}

          {watch('prizeCategory') === PrizeCategory.BONUS && (
            <div className="flex">
              <div className="w-100">
                <p className="addMemberDialog__text">紅利價格:</p>
              </div>
              <FormInput name="bonusPrice" control={control} />
            </div>
          )}

          <div className="flex">
            <div className="w-100">
              <p className="addMemberDialog__text">狀態:</p>
            </div>
            <FormSelect
              name="status"
              control={control}
              options={[
                ...Object.entries(productStatusOptions).map(([key, label]) => {
                  return { value: key, label };
                }),
              ]}
            />
          </div>

          <div className="flex">
            <div className="w-100">
              <p className="addMemberDialog__text">規格:</p>
            </div>
            <FormInput name="specification" control={control} />
          </div>

          {watch('productType') !== ProductType.GACHA && (
            <div className="flex">
              <div className="w-100">
                <p className="addMemberDialog__text">商品類別:</p>
              </div>
              <FormSelect
                name="categoryId"
                control={control}
                options={[
                  { value: '', label: '請選擇' },
                  ...categories.map((cat: any) => ({
                    value: cat.categoryId,
                    label: cat.categoryName,
                  })),
                ]}
              />
            </div>
          )}

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
          </div>
          <div className="flex">
            <div className="w-100 image-preview">
              {bannerImages.map((image, index) => (
                <div key={index} className="image-item">
                  {typeof image === 'string' ? (
                    <div className="flex">
                      <img
                        src={getImageUrl(image)}
                        alt="商品圖片"
                        className="preview-image"
                        width={40}
                        height={40}
                      />
                    </div>
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
          </div>
          <div className="flex">
            <div className="w-100 image-preview">
              {images.map((image, index) => (
                <div key={index} className="image-item">
                  {typeof image === 'string' ? (
                    <div className="flex">
                      <img
                        src={getImageUrl(image)}
                        alt="商品圖片"
                        className="preview-image"
                        width={40}
                        height={40}
                      />
                    </div>
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
