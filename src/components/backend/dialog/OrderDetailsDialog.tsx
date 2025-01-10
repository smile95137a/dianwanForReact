import { FC } from 'react';
import BDialog from './BDialog';
import MButton from '../MButton';
import { useForm } from 'react-hook-form';
import { useBackendDialog } from '@/context/backend/useBackendDialog';
import { useLoading } from '@/context/frontend/LoadingContext';
import { FormInput } from '../FormInput';
import { updateSliver } from '@/services/backend/UserService';
import BTable from '../btable/BTable';
import BTableRow from '../btable/BTableRow';
import { getImageUrl } from '@/utils/ImageUtils';
import NumberFormatter from '@/components/common/NumberFormatter';

interface OrderDetailsDialogProps {
  isOpen: boolean;
  onClose: (result: boolean) => void;
  onConfirm: () => void;
  customClass?: string;
  order: any;
}

const OrderDetailsDialog: FC<OrderDetailsDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  customClass,
  order,
}) => {
  const { openInfoDialog, openConfirmDialog } = useBackendDialog();
  const { setLoading } = useLoading();

  return (
    <BDialog
      isOpen={isOpen}
      onClose={() => onClose(false)}
      className={customClass}
      mainClassName="max-w-640"
    >
      <div className="orderDetailsDialog">
        <p className="orderDetailsDialog__text orderDetailsDialog__text--title">
          訂單明細 - 訂單號:
        </p>

        <div className="orderDetailsDialog__main">
          <BTable
            headers={[
              { text: '產品 ID', className: '' },
              { text: '商品名稱', className: '' },
              { text: '產品名稱', className: '' },
              { text: '產品圖片', className: '' },
              { text: '數量', className: '' },
              { text: '單價', className: '' },
              { text: '類型', className: '' },
            ]}
          >
            {order.orderDetails.map((detail, index) => (
              <BTableRow
                key={index}
                data={[
                  {
                    content: (
                      <>
                        {' '}
                        {detail.storeProduct?.storeProductId ||
                          detail.productDetailRes?.productDetailId ||
                          'N/A'}
                      </>
                    ),
                    dataTitle: '產品 ID',
                  },
                  {
                    content: <>{detail.pname}</>,
                    dataTitle: '商品名稱',
                  },
                  {
                    content: (
                      <>
                        {detail.storeProduct ? (
                          <div>
                            <p>
                              <strong>{detail.storeProduct.productName}</strong>
                            </p>
                          </div>
                        ) : detail.productDetailRes ? (
                          <div>
                            <p>
                              <strong>
                                {detail.productDetailRes.productName}
                              </strong>
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p>無產品</p>
                          </div>
                        )}
                      </>
                    ),
                    dataTitle: '產品名稱',
                  },
                  {
                    content: (
                      <>
                        {detail.storeProduct &&
                        Array.isArray(detail.storeProduct.imageUrls) &&
                        detail.storeProduct.imageUrls.length > 0 ? (
                          <img
                            src={getImageUrl(detail.storeProduct.imageUrls[0])}
                            alt="Store Product Image"
                            style={{ width: '100px', height: '100px' }}
                          />
                        ) : detail.productDetailRes &&
                          Array.isArray(detail.productDetailRes.imageUrls) &&
                          detail.productDetailRes.imageUrls.length > 0 ? (
                          <img
                            src={getImageUrl(
                              detail.productDetailRes.imageUrls[0]
                            )}
                            alt="Product Detail Image"
                            style={{ width: '100px', height: '100px' }}
                          />
                        ) : null}
                      </>
                    ),
                    dataTitle: '產品圖片',
                  },
                  {
                    content: (
                      <>
                        <NumberFormatter number={detail.quantity} />
                      </>
                    ),
                    dataTitle: '數量',
                  },
                  {
                    content: (
                      <>
                        <NumberFormatter
                          number={
                            detail.unitPrice === null ? 0 : detail.unitPrice
                          }
                        />
                        元
                      </>
                    ),
                    dataTitle: '單價',
                  },
                  {
                    content: (
                      <>
                        {detail.productDetailRes?.productDetailId ? (
                          <p>
                            <strong>{detail.productDetailRes.grade}賞</strong>
                          </p>
                        ) : (
                          <p>
                            <strong>商城商品</strong>
                          </p>
                        )}
                      </>
                    ),
                    dataTitle: '類型',
                  },
                ]}
              />
            ))}
          </BTable>
        </div>
      </div>
    </BDialog>
  );
};

export default OrderDetailsDialog;
