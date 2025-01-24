import { FC, useEffect, useState } from 'react';
import BDialog from './BDialog';
import MButton from '../MButton';
import {
  deleteCategory,
  deleteProductDetail,
  getAllProductDetails,
} from '@/services/backend/ProductService';
import { useBackendDialog } from '@/context/backend/useBackendDialog';
import { useLoading } from '@/context/frontend/LoadingContext';
import { usePagination } from '@/hooks/usePagination';
import Card from '@/components/frontend/MCard';
import BTable from '../btable/BTable';
import BTableRow from '../btable/BTableRow';
import NoData from '../NoData';
import Pagination from '../Pagination';
import NumberFormatter from '@/components/common/NumberFormatter';

interface ProductDetailDialogProps {
  isOpen: boolean;
  onClose: (result: boolean) => void;
  onConfirm: () => void;
  customClass?: string;
  product: any;
}

const ProductDetailDialog: FC<ProductDetailDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  customClass,
  product,
}) => {
  const [list, setList] = useState<any[]>([]);
  const pagination = usePagination({
    list,
    pageLimitSize: 10,
    initialPage: 1,
  });

  const { openConfirmDialog, openInfoDialog, openAddProductDetailDialog } =
    useBackendDialog();
  const { setLoading } = useLoading();

  const handleEdit = async (data: any) => {
    const result = await openAddProductDetailDialog(product, true, data);
    if (result) {
      fetchProductDetails();
    }
  };

  const handleDelete = async (categoryId: any) => {
    const result = await openConfirmDialog(
      '系統提示',
      '確定要刪除此產品類別嗎？'
    );
    if (result) {
      try {
        setLoading(true);
        const { success } = await deleteProductDetail(categoryId);
        setLoading(false);
        if (success) {
          await openInfoDialog('系統提示', '產品類別 已成功刪除！');
          fetchProductDetails();
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
  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const { success, data } = await getAllProductDetails();
      setLoading(false);
      if (success) {
        const filteredDetails = data.filter(
          (detail: any) => detail.productId === product.productId
        );
        setList(filteredDetails);
      } else {
        setList([]);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching categories:', error);
      setList([]);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, []);

  const handelAddPDialog = async () => {
    const result = await openAddProductDetailDialog(product);
    if (result) {
      fetchProductDetails();
    }
  };

  const totalQuantity = list.reduce((sum, detail) => sum + detail.quantity, 0);

  return (
    <BDialog
      isOpen={isOpen}
      onClose={() => onClose(false)}
      customClassName={customClass}
      mainClassName="max-w-640"
    >
      <div className="productDetailDialog">
        <p className="productDetailDialog__text productDetailDialog__text--title">
          產品詳情
        </p>
        <p className="productDetailDialog__text productDetailDialog__text--total">
          總數量：
          <NumberFormatter number={~~totalQuantity} />
        </p>
        <div className="productDetailDialog__btns m-b-12">
          <MButton text={'新增商品類別'} click={handelAddPDialog} />
        </div>
        <div className="productDetailDialog__main">
          {list.length > 0 ? (
            <BTable
              headers={[
                { text: '商品名稱', className: '' },
                { text: '數量', className: '' },
                { text: '等級', className: '' },
                { text: '操作', className: '' },
              ]}
            >
              {pagination.currentPageItems.map((x, index) => (
                <BTableRow
                  key={index}
                  data={[
                    {
                      content: <>{x.productName}</>,
                      dataTitle: '商品名稱',
                    },
                    {
                      content: (
                        <>
                          <NumberFormatter number={~~x.quantity} />
                        </>
                      ),
                      dataTitle: '數量',
                    },
                    {
                      content: <>{x.grade}</>,
                      dataTitle: '等級',
                    },
                    {
                      content: (
                        <>
                          <div className="productDetailDialog__btns">
                            <MButton
                              text={'編輯'}
                              click={() => handleEdit(x)}
                            />
                            <MButton
                              text={'刪除'}
                              click={() => handleDelete(x.productDetailId)}
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

export default ProductDetailDialog;
