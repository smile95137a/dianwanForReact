import { FC, useEffect, useState } from 'react';
import BDialog from './BDialog';
import MButton from '../MButton';
import { useForm } from 'react-hook-form';
import { FormSelect } from '../FormSelect';
import {
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

  const { openConfirmDialog, openInfoDialog } = useBackendDialog();
  const { setLoading } = useLoading();

  const handleDeleteCategory = async (categoryId) => {};
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
  return (
    <BDialog
      isOpen={isOpen}
      onClose={() => onClose(false)}
      className={customClass}
    >
      <div className="productCategoryManagementDialog">
        <p className="productCategoryManagementDialog__text productCategoryManagementDialog__text--title">
          商品類別管理
        </p>
        <div className="productCategoryManagementDialog__main">
          {' '}
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
                          <div className="categoryManagement__btns">
                            <button className="categoryManagement__btn categoryManagement__btn--edit">
                              編輯
                            </button>
                            <button
                              className="categoryManagement__btn categoryManagement__btn--del"
                              onClick={() =>
                                handleDeleteCategory(category.categoryId)
                              }
                            >
                              刪除
                            </button>
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
