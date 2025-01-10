import { FC } from 'react';
import BDialog from './BDialog';
import MButton from '../MButton';
import { useForm } from 'react-hook-form';
import { useBackendDialog } from '@/context/backend/useBackendDialog';
import { useLoading } from '@/context/frontend/LoadingContext';
import { FormInput } from '../FormInput';
import { updateSliver } from '@/services/backend/UserService';

interface GrantRewardDialogProps {
  isOpen: boolean;
  onClose: (result: boolean) => void;
  onConfirm: () => void;
  customClass?: string;
  memberList: any[];
}

const GrantRewardDialog: FC<GrantRewardDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  customClass,
  memberList,
}) => {
  const { control, getValues, reset } = useForm({
    defaultValues: {
      silverAmount: 0,
      bonusAmount: 0,
    },
  });

  const { openInfoDialog, openConfirmDialog } = useBackendDialog();
  const { setLoading } = useLoading();

  const validateForm = () => {
    const { silverAmount, bonusAmount } = getValues();
    try {
      if (~~silverAmount < 0) {
        throw new Error('銀幣數量必須為非負數！');
      }
      if (~~bonusAmount < 0) {
        throw new Error('紅利數量必須為非負數！');
      }
    } catch (error) {
      if (error instanceof Error) {
        openInfoDialog('系統提示', error.message);
      } else {
        openInfoDialog('系統提示', '未知錯誤，請稍後再試！');
      }
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    const { silverAmount, bonusAmount } = getValues();
    const result = await openConfirmDialog(
      '系統提示',
      `確定要發放 ${silverAmount} 銀幣和 ${bonusAmount} 紅利點數給 ${memberList.length} 位會員嗎？`
    );

    if (result) {
      if (validateForm()) {
        try {
          const sliverUpdate = {
            userId: memberList.map((x) => x.id),
            sliverCoin: silverAmount,
            bonus: bonusAmount,
          };

          setLoading(true);
          const { success, message } = await updateSliver(sliverUpdate);
          setLoading(false);

          if (success) {
            await openInfoDialog(
              '系統提示',
              `已成功發放 ${silverAmount} 銀幣和 ${bonusAmount} 紅利點數給 ${memberList.length} 位會員。`
            );
            onClose(true);
            onConfirm();
          } else {
            await openInfoDialog(
              '系統提示',
              message || '獎勵發放失敗，請稍後再試！'
            );
          }
        } catch (error) {
          setLoading(false);
          console.error('獎勵發放失敗:', error);
          await openInfoDialog(
            '系統提示',
            '發放獎勵過程中出現錯誤，請稍後再試！'
          );
        }
      }
    }
  };

  return (
    <BDialog
      isOpen={isOpen}
      onClose={() => onClose(false)}
      className={customClass}
      mainClassName="max-w-640"
    >
      <div className="grantRewardDialog">
        <p className="grantRewardDialog__text grantRewardDialog__text--title">
          發放獎勵
        </p>
        <p className="grantRewardDialog__text">
          選中的會員數：{memberList.length}
        </p>

        <div className="grantRewardDialog__main">
          <div className="flex">
            <div className="w-100">
              <p className="grantRewardDialog__text">銀幣數量:</p>
            </div>
            <FormInput
              name="silverAmount"
              control={control}
              type="number"
              placeholder="輸入銀幣數量"
              rules={{ min: 0, required: '請輸入銀幣數量' }}
            />
          </div>
          <div className="flex">
            <div className="w-100">
              <p className="grantRewardDialog__text">紅利數量:</p>
            </div>
            <FormInput
              name="bonusAmount"
              control={control}
              type="number"
              placeholder="輸入紅利數量"
              rules={{ min: 0, required: '請輸入紅利數量' }}
            />
          </div>
        </div>
        <div className="grantRewardDialog__btns">
          <MButton text={'取消'} click={() => onClose(false)} />
          <MButton text={'發送'} click={handleSubmit} />
        </div>
      </div>
    </BDialog>
  );
};

export default GrantRewardDialog;
