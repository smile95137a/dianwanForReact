import { FC, useEffect, useState } from 'react';
import BDialog from './BDialog';
import MButton from '../MButton';

import { useBackendDialog } from '@/context/backend/useBackendDialog';
import { useLoading } from '@/context/frontend/LoadingContext';
import { usePagination } from '@/hooks/usePagination';
import Card from '@/components/frontend/MCard';
import BTable from '../btable/BTable';
import BTableRow from '../btable/BTableRow';
import NoData from '../NoData';
import Pagination from '../Pagination';
import {
  deleteCategory,
  getAllCategories,
} from '@/services/backend/StoreServices';

interface ProductStoreCategoryManagementDialogProps {
  isOpen: boolean;
  onClose: (result: boolean) => void;
  onConfirm: () => void;
  customClass?: string;
}

const ProductStoreCategoryManagementDialog: FC<
  ProductStoreCategoryManagementDialogProps
> = ({ isOpen, onClose, onConfirm, customClass }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const pagination = usePagination({
    list: categories,
    pageLimitSize: 10,
    initialPage: 1,
  });

  const {
    openConfirmDialog,
    openInfoDialog,
    openAddProductStoreCategoryDialog,
  } = useBackendDialog();
  const { setLoading } = useLoading();

  const handleEditCategory = async (category: any) => {
    const result = await openAddProductStoreCategoryDialog(true, category);
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
        setCategories(data);
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

  const handelAddPSCDialog = async () => {
    const result = await openAddProductStoreCategoryDialog();
    if (result) {
      fetchCategories();
    }
  };

  return (
    <BDialog
      isOpen={isOpen}
      onClose={() => onClose(false)}
      className={customClass}
      mainClassName="max-w-720"
    >
      <div className="productStoreCategoryManagementDialog">
        <p className="productStoreCategoryManagementDialog__text productStoreCategoryManagementDialog__text--title">
          商品類別管理
        </p>
        <div className="productStoreCategoryManagementDialog__btns m-y-12">
          <MButton text={'新增商品類別'} click={handelAddPSCDialog} />
        </div>
        <div className="productStoreCategoryManagementDialog__main">
          {categories.length > 0 ? (
            <BTable
              headers={[
                { text: '類別名稱', className: '' },
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
                      content: (
                        <>
                          <div className="productStoreCategoryManagementDialog__btns">
                            <MButton
                              text={'編輯'}
                              click={() => handleEditCategory(category)}
                            />
                            <MButton
                              text={'刪除'}
                              click={() =>
                                handleDeleteCategory(category.categoryId)
                              }
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

export default ProductStoreCategoryManagementDialog;
