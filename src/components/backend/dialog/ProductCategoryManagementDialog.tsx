import { FC, useEffect, useState } from 'react';
import BDialog from './BDialog';
import MButton from '../MButton';
import { useForm } from 'react-hook-form';
import { FormSelect } from '../FormSelect';
import {
  deleteCategory,
  getAllCategories,
  getAllProductsByType,
} from '@/services/backend/ProductService';
import { useBackendDialog } from '@/context/backend/useBackendDialog';
import { useLoading } from '@/context/frontend/LoadingContext';
import { generateRedemptionCode } from '@/services/backend/RedemptionService';
import { createBanner } from '@/services/backend/BannerService';
import { usePagination } from '@/hooks/usePagination';
import Card from '@/components/frontend/MCard';
import BTable from '../btable/BTable';
import BTableRow from '../btable/BTableRow';
import NoData from '../NoData';
import Pagination from '../Pagination';

interface ProductCategoryManagementDialogProps {
  isOpen: boolean;
  onClose: (result: boolean) => void;
  onConfirm: () => void;
  customClass?: string;
}

const ProductCategoryManagementDialog: FC<
  ProductCategoryManagementDialogProps
> = ({ isOpen, onClose, onConfirm, customClass }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const pagination = usePagination({
    list: categories,
    pageLimitSize: 10,
    initialPage: 1,
  });

  const { openConfirmDialog, openInfoDialog, openAddProductCategoryDialog } =
    useBackendDialog();
  const { setLoading } = useLoading();

  const handleEditCategory = async (category: any) => {
    const result = await openAddProductCategoryDialog(true, category);
    if (result) {
      fetchCategories();
    }
  };

  const handleDeleteCategory = async (categoryId: any) => {
    const result = await openConfirmDialog(
      '系統提示',
      '確定要刪除此產品類別嗎？'
    );
    if (result) {
      try {
        setLoading(true);
        const { success } = await deleteCategory(categoryId);
        setLoading(false);
        if (success) {
          await openInfoDialog('系統提示', '產品類別 已成功刪除！');
          fetchCategories();
        } else {
          await openInfoDialog('系統提示', '刪除失敗，請稍後再試！');
        }
      } catch (error) {
        setLoading(false);
        console.error('Error deleting 產品類別:', error);
        await openInfoDialog('系統提示', '刪除失敗，請稍後再試！');
      }
    }
  };
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { success, data } = await getAllCategories();
      setLoading(false);
      if (success) {
        setCategories(data.categories);
      } else {
        setCategories([]);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handelAddPCDialog = async () => {
    const result = await openAddProductCategoryDialog();
    if (result) {
      fetchCategories();
    }
  };

  return (
    <BDialog
      isOpen={isOpen}
      onClose={() => onClose(false)}
      customClassName={customClass}
      mainClassName="max-w-720"
    >
      <div className="productCategoryManagementDialog">
        <p className="productCategoryManagementDialog__text productCategoryManagementDialog__text--title">
          商品類別管理
        </p>
        <div className="productCategoryManagementDialog__btns m-y-12">
          <MButton text={'新增商品類別'} click={handelAddPCDialog} />
        </div>
        <div className="productCategoryManagementDialog__main">
          {categories.length > 0 ? (
            <BTable
              headers={[
                { text: '類別名稱', className: '' },
                { text: '排序號碼', className: '' },
                { text: '操作', className: '' },
              ]}
            >
              {pagination.currentPageItems.map((category, index) => (
                <BTableRow
                  key={index}
                  data={[
                    {
                      content: <>{category.categoryName}</>,
                      dataTitle: '類別名稱',
                    },
                    {
                      content: <>{category.productSort}</>,
                      dataTitle: '排序號碼',
                    },
                    {
                      content: (
                        <>
                          <div className="productCategoryManagementDialog__btns">
                            <MButton
                              text={'編輯'}
                              click={() => handleEditCategory(category)}
                            />
                            <MButton
                              text={'刪除'}
                              click={() => handleDeleteCategory(category)}
                            />
                          </div>
                        </>
                      ),
                      dataTitle: '操作',
                    },
                  ]}
                />
              ))}
            </BTable>
          ) : (
            <Card>
              <NoData />
            </Card>
          )}
          <Pagination {...pagination} />
        </div>
      </div>
    </BDialog>
  );
};

export default ProductCategoryManagementDialog;
