import { FC, useEffect, useState } from 'react';
import BDialog from './BDialog';
import MButton from '../MButton';
import { useForm } from 'react-hook-form';
import { FormSelect } from '../FormSelect';
import { FormInput } from '../FormInput';
import { createUser, updateUser } from '@/services/backend/UserService';
import { useBackendDialog } from '@/context/backend/useBackendDialog';
import { useLoading } from '@/context/frontend/LoadingContext';

interface AddMemberDialogProps {
  isOpen: boolean;
  onClose: (result: boolean) => void;
  onConfirm: () => void;
  isEdit?: boolean;
  member?: any;
}

const AddMemberDialog: FC<AddMemberDialogProps> = ({
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

  const { openInfoDialog } = useBackendDialog();
  const { setLoading } = useLoading();

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

  const validateForm = async () => {
    const { username, nickName, phoneNumber, address, roleId } = getValues();

    try {
      if (!username.trim()) {
        throw new Error('帳號為必填項！');
      }
      if (!nickName.trim()) {
        throw new Error('暱稱為必填項！');
      }
      if (!phoneNumber.trim()) {
        throw new Error('電話號碼為必填項！');
      }
      if (!/^\d{10}$/.test(phoneNumber)) {
        throw new Error('電話號碼格式無效，必須為 10 位數字！');
      }
      if (!address.trim()) {
        throw new Error('地址為必填項！');
      }
      if (roleId < 1 || roleId > 5) {
        throw new Error('請選擇有效的角色！');
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
      const formData = getValues();

      try {
        setLoading(true);
        const { success, data, code, message } = isEdit
          ? await updateUser(member.id, formData)
          : await createUser(formData);

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
    <BDialog isOpen={isOpen} onClose={() => onClose(false)}>
      <div className="addMemberDialog">
        <p className="addMemberDialog__text addMemberDialog__text--title">
          新增會員
        </p>
        <div className="addMemberDialog__main">
          <div className="flex">
            <div className="w-100">
              <p className="addMemberDialog__text">帳號:</p>
            </div>
            <FormInput name="username" control={control} />
          </div>

          <div className="flex">
            <div className="w-100">
              <p className="addMemberDialog__text">暱稱:</p>
            </div>
            <FormInput name="nickName" control={control} />
          </div>

          <div className="flex">
            <div className="w-100">
              <p className="addMemberDialog__text">電話號碼:</p>
            </div>
            <FormInput name="phoneNumber" control={control} />
          </div>

          <div className="flex">
            <div className="w-100">
              <p className="addMemberDialog__text">地址:</p>
            </div>
            <FormInput name="address" control={control} />
          </div>

          <div className="flex">
            <div className="w-100">
              <p className="addMemberDialog__text">角色:</p>
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
        <div className="addMemberDialog__btns">
          <MButton
            text={'取消'}
            customClass="addMemberDialog__btn"
            click={() => onClose(false)}
          />
          <MButton
            text={isEdit ? '儲存' : '新增'}
            customClass="addMemberDialog__btn"
            click={handleSubmit}
          />
        </div>
      </div>
    </BDialog>
  );
};

export default AddMemberDialog;
