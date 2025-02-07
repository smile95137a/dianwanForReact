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
import { executeDraw, redeemCode } from '@/services/frontend/drawService';
interface TicketConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data) => void;
  isCustmerPrize: boolean;
  inputCode: string;
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
  isCustmerPrize,
  inputCode,
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

      let response;
      if (isCustmerPrize) {
        response = await redeemCode({
          productId: productData.productId,
          prizeNumbers: ticketList.map((x: any) => x.number),
          payType,
          code: inputCode,
        });
      } else {
        response = await executeDraw(
          productData.productId,
          ticketList.map((x: any) => x.number),
          payType
        );
      }

      const { success, data, message } = response;
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
      const errorMessage = error.response?.data?.message || '未知錯誤';
      await openInfoDialog('系統消息', errorMessage);
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

  const handleReadNotice = async () => {
    await openInfoDialog(
      '閱讀文字',
      `
      <p>⚠ 購買須知 ⚠</p>
      <p>購買前請務必詳細閱讀以下規範，若無法接受，請勿購買！</p>
    
      <p><strong>購物車數量限制</strong></p>
      <p>每位買家賞品盒上限為 150 樣商品，請確認您的購物額度與空間充足。</p>
    
      <p><strong>抽獎型商品規則</strong></p>
      <p>本商城所有抽獎商品均屬【線上機率型】商品，抽選完成後不接受退換貨，請謹慎下單。</p>
    
      <p><strong>商品狀況與原廠標準</strong></p>
      <p>出貨商品存在原廠允許範圍內的輕微瑕疵，如塗裝不均、外盒擠壓痕跡等，均屬正常範疇，不屬於瑕疵退貨範圍。</p>
    
      <p><strong>退貨與開箱證明</strong></p>
      <p>若商品確實有嚴重瑕疵，可申請更換相同商品；若為限量或無備品，則視情況取消訂單。</p>
      <p>拆封前請全程錄影，且影片需完整無剪輯，否則將無法受理退貨申請。</p>
    
      <p><strong>中獎機制與獎勵</strong></p>
      <p>虛擬遊戲帳號獎賞皆不保留 7 天退換貨，如獎品抽出後續有問題，除本身帳號資料無法全移交，否則一概無退貨。</p>
    
      <p>請確認填寫的個人資訊無誤，如因填錯資訊導致配送失敗或損失，將由買方自行承擔責任。</p>
    
      <p>📌 購買即代表同意上述規範，請理性消費！</p>
      `
    );
  };

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
                <span
                  onClick={handleReadNotice}
                  className="ticketConfirmDialog__link"
                >
                  閱讀
                </span>
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
