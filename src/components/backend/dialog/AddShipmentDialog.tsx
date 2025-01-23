import { FC, useEffect, useState } from 'react';
import BDialog from './BDialog';
import MButton from '../MButton';
import { useForm } from 'react-hook-form';
import { useBackendDialog } from '@/context/backend/useBackendDialog';
import { useLoading } from '@/context/frontend/LoadingContext';
import { FormInput } from '../FormInput';
import {
  createShippingMethod,
  updateShippingMethod,
} from '@/services/backend/ShipService';

interface AddShipmentDialogProps {
  isOpen: boolean;
  onClose: (result: boolean) => void;
  onConfirm: () => void;
  isEdit?: boolean;
  shipment?: any;
  customClass?: string;
}

const AddShipmentDialog: FC<AddShipmentDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isEdit = false,
  shipment,
  customClass,
}) => {
  const { control, getValues, reset } = useForm({
    defaultValues: {
      name: '',
      minSize: '',
      maxSize: '',
      shippingPrice: '',
    },
  });

  const { openInfoDialog } = useBackendDialog();
  const { setLoading } = useLoading();

  useEffect(() => {
    const defaultValues = {
      name: '',
      minSize: '',
      maxSize: '',
      shippingPrice: '',
    };

    if (isEdit && shipment) {
      defaultValues.name = shipment.name;
      defaultValues.minSize = shipment.minSize;
      defaultValues.maxSize = shipment.maxSize;
      defaultValues.shippingPrice = shipment.shippingPrice;
    }
    reset(defaultValues);
  }, [isEdit, shipment, reset]);

  const validateForm = async () => {
    const { name, minSize, maxSize, shippingPrice } = getValues();

    try {
      if (!name.trim()) {
        throw new Error('名稱為必填項！');
      }

      if (~~minSize < 0 || ~~maxSize <= 0 || ~~minSize >= ~~maxSize) {
        throw new Error('尺寸範圍無效，請檢查最小尺寸和最大尺寸！');
      }
      if (~~shippingPrice < 0) {
        throw new Error('運費必須為非負數！');
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
    if (await validateForm()) {
      const shipmentData = getValues();

      try {
        setLoading(true);
        const formData = getValues();
        const { success, data, code, message } =
          isEdit && shipment
            ? await updateShippingMethod(shipment.shippingMethodId, {
                ...shipmentData,
              })
            : await createShippingMethod(formData);
        setLoading(false);

        if (success) {
          await openInfoDialog(
            '系統提示',
            isEdit ? '更新成功！' : '新增成功！'
          );
          onClose(true);
        } else {
          await openInfoDialog('系統提示', message || '操作失敗，請稍後再試！');
        }
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
      <div className="addShipmentDialog">
        <p className="addShipmentDialog__text addShipmentDialog__text--title">
          {isEdit ? '編輯運輸方式' : '新增運輸方式'}
        </p>
        <div className="addShipmentDialog__main">
          <div className="flex">
            <div className="w-100">
              <p className="addShipmentDialog__text">名稱:</p>
            </div>
            <FormInput name="name" control={control} />
          </div>
          <div className="flex">
            <div className="w-100">
              <p className="addShipmentDialog__text">最小尺寸:</p>
            </div>
            <FormInput name="minSize" control={control} />
          </div>

          <div className="flex">
            <div className="w-100">
              <p className="addShipmentDialog__text">最大尺寸:</p>
            </div>
            <FormInput name="maxSize" control={control} />
          </div>

          <div className="flex">
            <div className="w-100">
              <p className="addShipmentDialog__text">運費:</p>
            </div>
            <FormInput name="shippingPrice" control={control} />
          </div>
        </div>
        <div className="addShipmentDialog__btns">
          <MButton text={'取消'} click={() => onClose(false)} />
          <MButton text={isEdit ? '儲存' : '新增'} click={handleSubmit} />
        </div>
      </div>
    </BDialog>
  );
};

export default AddShipmentDialog;
