import { FC } from 'react';
import { useForm } from 'react-hook-form';
import BDialog from './BDialog';
import { convenience } from '@/services/backend/OrderService';
import { FormInput } from '../FormInput';
import { FormSelect } from '../FormSelect';
import MButton from '../MButton';
import { useBackendDialog } from '@/context/backend/useBackendDialog';
import { useLoading } from '@/context/frontend/LoadingContext';

interface CreateShippingOrderDialogProps {
  isOpen: boolean;
  onClose: (result: boolean) => void;
  onConfirm: () => void;
  customClass?: string;
  order: any;
}

const CreateShippingOrderDialog: FC<CreateShippingOrderDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  customClass,
  order,
}) => {
  const { openInfoDialog } = useBackendDialog();
  const { setLoading } = useLoading();
  const methods = useForm({
    defaultValues: {
      vendorOrder: order?.orderNumber || '',
      logisticsMode: 'store',
      storeId: order?.shopId || '',
      opMode: order?.opmode || '1',
      amount: order?.totalAmount || '',
      orderAmount: '',
      senderName: '',
      sendMobilePhone: '',
      receiverName: order?.shippingName || '',
      receiverMobilePhone: order?.shippingPhone || '',
      shipmentDate: '',
    },
  });

  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors },
  } = methods;

  const validateForm = async () => {
    const {
      vendorOrder,
      logisticsMode,
      storeId,
      opMode,
      amount,
      orderAmount,
      senderName,
      sendMobilePhone,
      receiverName,
      receiverMobilePhone,
      shipmentDate,
    } = getValues();

    try {
      if (!`${vendorOrder}`.trim()) {
        throw new Error('客戶訂單編號為必填項！');
      }
      if (!`${logisticsMode}`.trim()) {
        throw new Error('物流方式為必填項！');
      }
      if (!`${storeId}`.trim()) {
        throw new Error('門市代號為必填項！');
      }
      if (!`${opMode}`.trim()) {
        throw new Error('通路代號為必填項！');
      }
      if (!`${amount}`.trim()) {
        throw new Error('交易金額為必填項！');
      }
      if (!`${orderAmount}`.trim()) {
        throw new Error('商品價值為必填項！');
      }
      if (!`${senderName}`.trim()) {
        throw new Error('寄件人姓名為必填項！');
      }
      if (!`${sendMobilePhone}`.trim()) {
        throw new Error('寄件人手機電話為必填項！');
      }
      if (!`${receiverName}`.trim()) {
        throw new Error('取貨人姓名為必填項！');
      }
      if (!`${receiverMobilePhone}`.trim()) {
        throw new Error('取貨人手機電話為必填項！');
      }
      if (!`${shipmentDate}`.trim()) {
        throw new Error('出貨日期為必填項！');
      }
      return true;
    } catch (error) {
      if (error instanceof Error) {
        await openInfoDialog('系統提示', error.message);
      }
      return false;
    }
  };

  const onSubmit = async () => {
    if (await validateForm()) {
      try {
        setLoading(true);
        const values = getValues();
        await convenience(values);
        setLoading(false);
        await openInfoDialog('系統提示', '訂單提交成功！');
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
      customClassName={customClass}
      mainClassName="max-w-640"
    >
      <div className="createShippingOrderDialog">
        <h3>建立物流訂單</h3>
        <div className="createShippingOrderDialog__main">
          <div className="flex">
            <div className="w-100">
              <p className="createShippingOrderDialog__text">客戶訂單編號:</p>
            </div>
            <FormInput
              name="vendorOrder"
              control={control}
              error={errors.vendorOrder?.message}
            />
          </div>

          <div className="flex">
            <div className="w-100">
              <p className="createShippingOrderDialog__text">物流方式:</p>
            </div>
            <FormSelect
              name="logisticsMode"
              control={control}
              options={[
                { value: '', label: '請選擇' },
                { value: 'store', label: '便利商店配送' },
              ]}
              error={errors.logisticsMode?.message}
            />
          </div>

          <div className="flex">
            <div className="w-100">
              <p className="createShippingOrderDialog__text">門市代號:</p>
            </div>
            <FormInput
              name="storeId"
              control={control}
              error={errors.storeId?.message}
            />
          </div>

          <div className="flex">
            <div className="w-100">
              <p className="createShippingOrderDialog__text">通路代號:</p>
            </div>
            <FormSelect
              name="opMode"
              control={control}
              options={[
                { value: '', label: '請選擇' },
                { value: '1', label: '全家' },
                { value: '3', label: '統一超商' },
              ]}
              error={errors.opMode?.message}
            />
          </div>
          <div className="flex">
            <div className="w-100">
              <p className="createShippingOrderDialog__text">交易金額:</p>
            </div>
            <FormInput
              name="amount"
              control={control}
              error={errors.amount?.message}
            />
          </div>

          <div className="flex">
            <div className="w-100">
              <p className="createShippingOrderDialog__text">商品價值:</p>
            </div>
            <FormInput
              name="orderAmount"
              control={control}
              error={errors.orderAmount?.message}
            />
          </div>

          <div className="flex">
            <div className="w-100">
              <p className="createShippingOrderDialog__text">寄件人姓名:</p>
            </div>
            <FormInput
              name="senderName"
              control={control}
              error={errors.senderName?.message}
            />
          </div>
          <div className="flex">
            <div className="w-100">
              <p className="createShippingOrderDialog__text">寄件人手機電話:</p>
            </div>
            <FormInput
              name="sendMobilePhone"
              control={control}
              error={errors.sendMobilePhone?.message}
            />
          </div>

          <div className="flex">
            <div className="w-100">
              <p className="createShippingOrderDialog__text">取貨人姓名:</p>
            </div>
            <FormInput
              name="receiverName"
              control={control}
              error={errors.receiverName?.message}
            />
          </div>

          <div className="flex">
            <div className="w-100">
              <p className="createShippingOrderDialog__text">取貨人手機電話:</p>
            </div>
            <FormInput
              name="receiverMobilePhone"
              control={control}
              error={errors.receiverMobilePhone?.message}
            />
          </div>
          <div className="flex">
            <div className="w-100">
              <p className="createShippingOrderDialog__text">出貨日期:</p>
            </div>
            <FormInput
              name="shipmentDate"
              type="datetime-local"
              control={control}
              error={errors.shipmentDate?.message}
            />
          </div>
          <div className="addProductDialog__btns">
            <MButton text="取消" click={() => onClose(false)} />
            <MButton text={'提交訂單'} click={onSubmit} />
          </div>
        </div>
      </div>
    </BDialog>
  );
};

export default CreateShippingOrderDialog;
