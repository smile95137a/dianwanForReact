import { FC, useEffect, useState } from 'react';
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
import {
  getAllVendor,
  saveTrackingNumberAPI,
} from '@/services/backend/OrderService';

interface OrderShipmentDialogProps {
  isOpen: boolean;
  onClose: (result: boolean) => void;
  onConfirm: () => void;
  customClass?: string;
  order: any;
}

const OrderShipmentDialog: FC<OrderShipmentDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  customClass,
  order,
}) => {
  const { openInfoDialog, openConfirmDialog } = useBackendDialog();
  const { setLoading } = useLoading();
  const [isEditing, setIsEditing] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');

  const toggleEdit = () => setIsEditing(!isEditing);

  const saveTrackingNumber = async () => {
    setIsEditing(false);
    try {
      const response = await saveTrackingNumberAPI({
        orderId: order.id,
        trackingNumber: trackingNumber,
      });
    } catch (error) {}
  };

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const vendor = await getAllVendor(order?.orderNumber);
        if (vendor?.data?.orderNo) {
          const formattedTrackingNumber =
            order.shippingMethod === '711'
              ? vendor.data.orderNo.slice(0, 8)
              : vendor.data.orderNo;
          setTrackingNumber(formattedTrackingNumber);
        }
      } catch (error) {
        console.error('Failed to fetch vendor data:', error);
      }
    };

    fetchVendorData();
  }, []);

  return (
    <BDialog
      isOpen={isOpen}
      onClose={() => onClose(false)}
      className={customClass}
    >
      <div className="orderShipmentDialog">
        <p className="orderShipmentDialog__text orderShipmentDialog__text--title">
          出貨單
        </p>
        <div className="info-section">
          <div className="left-section">
            <h3>寄送資訊</h3>
            <p>
              <strong>Email:</strong> {order.shippingEmail}
            </p>
            <p>
              <strong>姓名:</strong> {order.shippingName}
            </p>
            <p>
              <strong>電話:</strong> {order.shippingPhone}
            </p>
            <p>
              <strong>物流方式:</strong> {order.shippingMethod}
            </p>
            {order.shippingMethod === '711' ||
            order.shippingMethod === '全家' ? (
              <>
                <p>
                  <strong>門市代號:</strong> {order.storeCode}
                </p>
                <p>
                  <strong>門市名稱:</strong> {order.storeName}
                </p>
                <p>
                  <strong>門市地址:</strong> {order.storeAddress}
                </p>
              </>
            ) : (
              <p>
                <strong>寄送地址:</strong> {order.shippingAddress}
              </p>
            )}
            <p>
              <strong>物流單號:</strong>
              {!isEditing ? (
                trackingNumber || '無'
              ) : (
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="輸入物流單號"
                  className="tracking-input"
                />
              )}
            </p>
            <div className="button-group">
              {!isEditing ? (
                <button onClick={toggleEdit} className="edit-btn highlight-btn">
                  編輯
                </button>
              ) : (
                <button
                  onClick={saveTrackingNumber}
                  className="save-btn highlight-btn"
                >
                  保存
                </button>
              )}
            </div>
          </div>
          <div className="right-section">
            <h3>訂單資訊</h3>
            <p>
              <strong>訂單編號:</strong> {order.orderNumber}
            </p>
            <p>
              <strong>訂單日期:</strong> {order.createdAt}
            </p>
            <p>
              <strong>訂單總額:</strong> {order.totalAmount} 元
            </p>
            <p>
              <strong>運費總額:</strong> {order.shippingCost} 元
            </p>
            <p>
              <strong>商品總數:</strong> {order.orderDetails.length} 件
            </p>
          </div>
        </div>
        <div className="orderShipmentDialog__main">
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
                        detail.storeProduct.imageUrls ? (
                          <img
                            src={getImageUrl(detail.storeProduct.imageUrls[0])}
                            alt="Product Image"
                            style={{ width: '100px', height: '100px' }}
                          />
                        ) : detail.productDetailRes &&
                          detail.productDetailRes.imageUrls ? (
                          <img
                            src={getImageUrl(
                              detail.productDetailRes.imageUrls[0]
                            )}
                            alt="Product Image"
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

export default OrderShipmentDialog;
