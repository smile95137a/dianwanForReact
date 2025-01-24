import React, { FC } from 'react';
import Dialog from './Dialog';
import logoImg from '@/assets/image/logo.png';

interface FOrderDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderData: any;
}

const FOrderDetailDialog: FC<FOrderDetailDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  orderData,
}) => {
  console.log(orderData);

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="fOrderDetailDialog">
        <div className="fOrderDetailDialog__header">
          <div className="fOrderDetailDialog__logo">
            <img src={logoImg} className="fOrderDetailDialog__logo-img" />
          </div>
        </div>
        <div className="fOrderDetailDialog__title">
          <p className="fOrderDetailDialog__text">明細</p>
        </div>
        <div className="fOrderDetailDialog__main">
          <table className="fOrderDetailDialog__table">
            <thead>
              <tr>
                <th>商品名稱</th>
                <th>數量</th>
                <th>單價</th>
                <th>總價</th>
              </tr>
            </thead>
            <tbody>
              {orderData.orderDetails.map((detail: any, index: number) => (
                <tr key={index}>
                  <td>{detail.productName}</td>
                  <td>{detail.quantity}</td>
                  <td>{detail.unitPrice}</td>
                  <td>{detail.totalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="fOrderDetailDialog__summary">
            <p>訂單編號: {orderData.orderNumber}</p>
            <p>總金額: {orderData.totalAmount}</p>
            <p>運費: {orderData.shippingCost}</p>
            <p>付款方式: {orderData.paymentMethod}</p>
            <p>配送方式: {orderData.shippingMethod}</p>
            <p>
              配送地址:{' '}
              {`${orderData.shippingCity} ${orderData.shippingArea} ${orderData.shippingAddress}`}
            </p>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default FOrderDetailDialog;
