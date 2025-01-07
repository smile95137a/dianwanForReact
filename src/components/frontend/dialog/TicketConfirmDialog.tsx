import React, { FC } from 'react';
import Dialog from './Dialog';
import logoImg from '@/assets/image/logo.png';
import { useForm } from 'react-hook-form';
import NumberFormatter from '@/components/common/NumberFormatter';
import MoneyCard from '../MoneyCard';
import { useLoading } from '@/context/frontend/LoadingContext';
import { useFrontendDialog } from '@/context/frontend/useFrontedDialog';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { executeDraw } from '@/services/frontend/drawService';
interface TicketConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data) => void;
  payType: any;
  productData: any;
  ticketList: any[];
}
const validationSchema = Yup.object({
  terms: Yup.boolean().oneOf([true], '必須同意購買須知'),
});
const TicketConfirmDialog: FC<TicketConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  payType,
  productData,
  ticketList,
}) => {
  const { openInfoDialog } = useFrontendDialog();
  const { setLoading } = useLoading();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      terms: false,
    },
  });

  const onSubmit = async (values: any) => {
    try {
      setLoading(true);
      const { success, data, message } = await executeDraw(
        productData.productId,
        ticketList?.map((x: any) => x.number),
        payType
      );
      setLoading(false);
      if (success) {
        onConfirm(data);
      } else {
        await openInfoDialog('系統消息', message);
        onClose();
      }
    } catch (error) {
      setLoading(false);
      console.error('登入失敗:', error);
      await openInfoDialog('系統消息', '系統問題，請稍後再嘗試。');
    }
  };

  const getPaymentDetails = (payType: number) => {
    let logoText = '';
    let price = 0;
    let className = '';

    switch (payType) {
      case 1:
        logoText = 'G';
        price = ~~ticketList.length * productData.price;
        className = 'productCard__money--gold';
        break;
      case 2:
        logoText = 'S';
        price = ~~ticketList.length * productData.sliverPrice;
        className = 'productCard__money--silver';
        break;
      case 3:
        logoText = 'B';
        price = ~~ticketList.length * productData.bonusPrice;
        className = 'productCard__money--bonus';
        break;
    }

    return { logoText, price, className };
  };

  const { logoText, price, className } = getPaymentDetails(payType);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      className={`dialog--info ${'dialog--ticketList'}`}
    >
      <div className="ticketConfirmDialog">
        <div className="ticketConfirmDialog__header">
          <div className="ticketConfirmDialog__logo">
            <img
              src={logoImg}
              className="ticketConfirmDialog__logo-img"
              alt="Logo"
            />
          </div>
        </div>

        <div className="ticketConfirmDialog__main">
          <div className="ticketConfirmDialog__info">
            <div className="ticketConfirmDialog__info-total">
              <span className="ticketConfirmDialog__text">
                已選擇的籤紙：共
                <span className="ticketConfirmDialog__text ticketConfirmDialog__text--red">
                  <NumberFormatter number={~~ticketList.length} />
                </span>
                抽
              </span>
            </div>
            <div className="ticketConfirmDialog__info-money">
              <span className="ticketConfirmDialog__text">消耗代幣：</span>
              <MoneyCard
                className={className}
                logoText={logoText}
                price={price}
              />
            </div>
          </div>

          <div className="ticketConfirmDialog__numbers">
            {ticketList.map((ticket, index) => (
              <span key={index} className="ticketConfirmDialog__numbers-item">
                <NumberFormatter number={ticket.number} />
              </span>
            ))}
          </div>
          <div className="ticketConfirmDialog__divider"></div>
          <div className="ticketConfirmDialog__total">
            <div className="ticketConfirmDialog__total-text">
              <span className="ticketConfirmDialog__text">合計：</span>
            </div>
            <div className="ticketConfirmDialog__total-money">
              <MoneyCard
                className={className}
                logoText={logoText}
                price={price}
              />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="ticketConfirmDialog__checkboxes">
              <label className="ticketConfirmDialog__checkbox">
                <input
                  type="checkbox"
                  {...register('terms')}
                  className="ticketConfirmDialog__input"
                />
                <span className="ticketConfirmDialog__text">
                  我已詳閱購買須知
                </span>
                <a
                  href="#"
                  className="ticketConfirmDialog__link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  閱讀
                </a>
                {errors.terms && (
                  <p className="error-text">{errors.terms.message}</p>
                )}
              </label>
            </div>
            <div className="ticketConfirmDialog__divider"></div>
            <div className="ticketConfirmDialog__btns">
              <div
                className="ticketConfirmDialog__btn ticketConfirmDialog__btn--cancel"
                onClick={onClose}
              >
                取消
              </div>
              <button
                className="ticketConfirmDialog__btn ticketConfirmDialog__btn--confirm"
                type="submit"
                disabled={isSubmitting}
              >
                確認
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default TicketConfirmDialog;
