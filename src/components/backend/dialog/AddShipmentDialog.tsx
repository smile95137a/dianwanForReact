import { FC, useEffect, useState } from 'react';
import BDialog from './BDialog';
import MButton from '../MButton';
import { useForm } from 'react-hook-form';
import { FormSelect } from '../FormSelect';
import { FormInput } from '../FormInput';
import { createUser, updateUser } from '@/services/backend/UserService';

interface AddShipmentDialogProps {
  isOpen: boolean;
  onClose: (result: boolean) => void;
  onConfirm: () => void;
  isEdit?: boolean;
  member?: any;
}

const AddShipmentDialog: FC<AddShipmentDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isEdit = false,
  member,
}) => {
  const { control, watch, reset, getValues } = useForm({
    defaultValues: {
      username: '',
      nickName: '',
      phoneNumber: '',
      address: '',
      roleId: 1,
    },
  });

  useEffect(() => {
    const defaultValues = {
      username: '',
      nickName: '',
      phoneNumber: '',
      address: '',
      roleId: 1,
    };

    if (isEdit && member) {
      defaultValues.username = member.username || '';
      defaultValues.nickName = member.nickName || '';
      defaultValues.phoneNumber = member.phoneNumber || '';
      defaultValues.address = member.address || '';
      defaultValues.roleId = member.roleId || '';
    }
    reset(defaultValues);
  }, [isEdit, member, reset]);

  const handleSubmit = async () => {
    try {
      const formData = getValues();
      const { success, data } =
        isEdit && member
          ? await updateUser(member.id, { ...formData })
          : await createUser(formData);
      if (success) {
        onClose(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <BDialog isOpen={isOpen} onClose={() => onClose(false)}>
      <div className="AddShipmentDialog">
        <p>新增 會員</p>
        <div className="AddShipmentDialog__main">
          <div className="flex">
            <div className="w-100">
              <p className="AddShipmentDialog__text">帳號:</p>
            </div>
            <FormInput name="username" control={control} />
          </div>

          <div className="flex">
            <div className="w-100">
              <p className="AddShipmentDialog__text">暱稱:</p>
            </div>
            <FormInput name="nickName" control={control} />
          </div>

          <div className="flex">
            <div className="w-100">
              <p className="AddShipmentDialog__text">電話號碼:</p>
            </div>
            <FormInput name="phoneNumber" control={control} />
          </div>

          <div className="flex">
            <div className="w-100">
              <p className="AddShipmentDialog__text">地址:</p>
            </div>
            <FormInput name="address" control={control} />
          </div>

          <div className="flex">
            <div className="w-100">
              <p className="AddShipmentDialog__text">角色:</p>
            </div>
            <FormSelect
              name="roleId"
              control={control}
              options={[
                { value: 1, label: '權限控管管理者' },
                { value: 2, label: '一般管理者' },
                { value: 3, label: '驗證會員' },
                { value: 4, label: '未驗證會員' },
                { value: 5, label: '黑名單會員' },
              ]}
            />
          </div>
        </div>
        <div className="AddShipmentDialog__btns">
          <MButton
            text={'取消'}
            customClass="AddShipmentDialog__btn"
            click={() => onClose(false)}
          />
          <MButton
            text={isEdit ? '儲存' : '新增'}
            customClass="AddShipmentDialog__btn"
            click={handleSubmit}
          />
        </div>
      </div>
    </BDialog>
  );
};

export default AddShipmentDialog;
