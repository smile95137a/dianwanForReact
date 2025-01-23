import { FC, useEffect, useState } from 'react';
import BDialog from './BDialog';
import MButton from '../MButton';
import { useBackendDialog } from '@/context/backend/useBackendDialog';
import { useLoading } from '@/context/frontend/LoadingContext';
import { getImageUrl } from '@/utils/ImageUtils';
import NumberFormatter from '@/components/common/NumberFormatter';
import {
  getAllVendor,
  saveTrackingNumberAPI,
} from '@/services/backend/OrderService';
import { getShippingMethodName } from '@/enums/ShippingMethod';

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
  console.log(order);

  return (
    <BDialog
      isOpen={isOpen}
      onClose={() => onClose(false)}
      customClassName={`${customClass} bdialog--orderShipmentDialog `}
    >
      <div className="orderShipmentDialog">
        <p className="orderShipmentDialog__text orderShipmentDialog__text--title">
          出貨單
        </p>
        <button
          onClick={() => onClose(false)}
          className="orderShipmentDialog__btn"
        >
          關閉
        </button>
        <div className="flex">
          <div className="w-50">
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
                <strong>物流方式:</strong>{' '}
                {getShippingMethodName(order.shippingMethod)}
              </p>
              {order.shippingMethod === 'sevenEleven' ||
              order.shippingMethod === 'family' ? (
                <>
                  <p>
                    <strong>門市代號:</strong> {order.shopId}
                  </p>
                  <p>
                    <strong>門市名稱:</strong> {order.shopName}
                  </p>
                  <p>
                    <strong>門市地址:</strong> {order.shopAddress}
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
              <div className="orderShipmentDialog__btns">
                {!isEditing ? (
                  <button
                    onClick={toggleEdit}
                    className="orderShipmentDialog__btn"
                  >
                    編輯
                  </button>
                ) : (
                  <button
                    onClick={saveTrackingNumber}
                    className="orderShipmentDialog__btn"
                  >
                    保存
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="w-50">
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
        </div>

        <div className="orderShipmentDialog__main">
          <table className="product-list table">
            <thead>
              <tr>
                <th>商品名稱</th>
                <th>獎品名稱</th>
                <th>產品圖片</th>
                <th>類型</th>
                <th>數量</th>
              </tr>
            </thead>
            <tbody>
              {order.orderDetails.map((detail, index) => (
                <tr key={index}>
                  <td>
                    {detail.storeProduct?.storeProductId ||
                      detail.productDetailRes?.productDetailId ||
                      'N/A'}
                  </td>
                  <td>{detail.productDetailRes.pname}</td>
                  <td>
                    {detail.storeProduct ? (
                      <p>
                        <strong>{detail.storeProduct.productName}</strong>
                      </p>
                    ) : detail.productDetailRes ? (
                      <p>
                        <strong>{detail.productDetailRes.productName}</strong>
                      </p>
                    ) : (
                      <p>無產品</p>
                    )}
                  </td>
                  <td>
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
                        src={getImageUrl(detail.productDetailRes.imageUrls[0])}
                        alt="Product Detail Image"
                        style={{ width: '100px', height: '100px' }}
                      />
                    ) : null}
                  </td>
                  <td>
                    {detail.productDetailRes?.productDetailId ? (
                      <p>
                        <strong>{detail.productDetailRes.grade}賞</strong>
                      </p>
                    ) : (
                      <p>
                        <strong>商城商品</strong>
                      </p>
                    )}
                  </td>{' '}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </BDialog>
  );
};

export default OrderShipmentDialog;
