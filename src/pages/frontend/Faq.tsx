import React from 'react';

const Faq = () => {
  return (
    <>
      <div className="faq">
        <div className="faq__item">
          <div className="faq__item-title">
            <p className="faq__text">代幣購入須知</p>
          </div>
          <div className="faq__item-main">
            <p className="faq__text">
              1.購買前請三思，電玩賞(以下簡稱本網站)所販售之遊戲代幣，訂單成立後，將無法轉讓給第三者。
            </p>
            <p className="faq__text">
              2.電玩賞會員所儲值的金幣代幣等同於「現金禮券」，以下簡稱「代幣」。會員可以在電玩賞平台上消費任何商品。
            </p>
            <p className="faq__text">
              3.當會員確認儲值後，本網站系統會自動經由電子郵件方式通知會員，但並未表示交易完成或契約成立，本網站保留是否接受訂單權利，須待本網站確認交易條件無誤及確認收款後才算契約成立。
            </p>
            <p className="faq__text">
              4.本網站進行的所有消費，都以電腦系統記錄的電子交易資料為認定標準，若發現有任何異狀，請立即與客服人員聯繫。
            </p>
          </div>
        </div>

        <div className="faq__item">
          <div className="faq__item-title">
            <p className="faq__text">什麼狀況下需要開立發票？</p>
          </div>
          <div className="faq__item-main">
            <p className="faq__text">
              發票開立相關資訊請依財政部公告內容為主，請參考財政部稅務網站：
            </p>
            <p className="faq__text">
              1.電玩賞將於儲值完後，由系統自動開立電子發票到會員註冊的Email。
            </p>
          </div>
        </div>

        <div className="faq__item">
          <div className="faq__item-title">
            <p className="faq__text">退費相關</p>
          </div>
          <div className="faq__item-main">
            <p className="faq__text">
              1.如欲取消帳戶內剩餘之代幣，本公司依照剩餘金幣代幣總額，並扣除退費手續費100元後進行退款。
            </p>
            <p className="faq__text">
              2.請至服務信箱聯絡我們，填寫您的退款帳務及提出申請取消交易。
            </p>
            <p className="faq__text">
              3.客服中心在收到取消交易申請後，會請您提交相關資料，在您填妥退款申請書，約14~18個工作天後會將您所支付的金額(或是帳戶餘額)扣除相關手續費用，匯至您提供的帳戶。
            </p>
          </div>
        </div>

        <div className="faq__item">
          <div className="faq__item-title">
            <p className="faq__text">儲值流程教學</p>
          </div>
          <div className="faq__item-main">
            <p className="faq__text">
              1.登入會員-&gt;會員中心-&gt;代幣儲值，選擇要購買的代幣數量→確認。
            </p>
            <p className="faq__text">
              2.轉跳信用卡畫面後，輸入簡訊認證碼，完成儲值。
            </p>
          </div>
        </div>

        <div className="faq__item">
          <div className="faq__item-title">
            <p className="faq__text">遊戲獎品</p>
          </div>
          <div className="faq__item-main">
            <p className="faq__text">
              1.獎品照片與實際商品可能會有色彩差異，圖片僅供參考，以實際商品顏色與規格為主。
            </p>
            <p className="faq__text">
              2.獎品皆為工廠大量生產，如有塗裝、溢漆、掉色、色差、...等問題，
              不屬於商品瑕疵，本網站不接受因非缺件之因素申請退換貨，無法接受請勿使用本網站服務。
            </p>
            <p className="faq__text">
              3.商品可發貨時間皆為預估，正確時間以原廠及代理商公告為主。
            </p>
          </div>
        </div>

        <div className="faq__item">
          <div className="faq__item-title">
            <p className="faq__text">寄送說明</p>
          </div>
          <div className="faq__item-main">
            <p className="faq__text">
              1.超商寄出的包裹因未取件而退回，將由系統自動扣除代幣/紅利/免運券再次寄出。
            </p>
            <p className="faq__text">
              2.遊戲獎品累計20天(以最後獲取獎品日開始算)，將自動扣除代幣/紅利/免運券，以郵寄方式寄送至會員註冊地址。
            </p>
            <p className="faq__text">
              3.若收到獎品有任何問題請3天內開箱錄影並聯繫客服，碰到缺件或著功能失效，請務必提供開箱影片作為依據!!
              逾期將不受理。
            </p>
            <p className="faq__text">
              4.獎品皆以紙箱包裝避免運輸碰撞造成嚴重損壞，但運送途中內外盒都可能受到撞擊/擠壓，無法保證盒況，若十分在意盒況者請三思後再遊玩。
            </p>
            <p className="faq__text">5.若自動寄出商品無人收件視同放棄獎品。</p>
            <p className="faq__text">
              6.放棄的獎品累積至一定數量，本公司將統一捐給慈善機構。
            </p>
          </div>
        </div>

        <div className="faq__item">
          <div className="faq__item-title">
            <p className="faq__text">系統安全</p>
          </div>
          <div className="faq__item-main">
            <p className="faq__text">
              1.本網站所提供之各項功能，均依該功能當時之現況提供使用，本公司對於其效能、速度、完整性、可靠性、安全性、正確性等，皆不負擔任何明示或默示之擔保責任。
            </p>
            <p className="faq__text">
              2.本公司並不保證本網站、伺服器、網域等所傳送的電子郵件或其內容不會含有電腦病毒等有害物；亦不保證郵件、檔案或資料之傳輸儲存均正確無誤不會斷線和出錯等，因各該郵件、檔案或資料傳送或儲存失敗、遺失或錯誤等所致之損害，本公司不負賠償責任。如會員發現本網站系統有錯誤或疏失，請立即通知本公司。
            </p>
            <p className="faq__text">
              3.於發生下列情形之一時，本公司有權停止、中斷本服務：
            </p>
            <div className="m-l-40">
              <p className="faq__text">
                3.1電子通信設備進行必要之保養及施工時；
              </p>
              <p className="faq__text">3.2發生突發性之電子通信設備故障時；</p>
              <p className="faq__text">
                3.3申請之電子通信服務被停止，無法提供服務時；
              </p>
              <p className="faq__text">
                3.4由於天災等不可抗力之因素或其他不可歸責於本公司之事由發生時。
              </p>
            </div>
          </div>
        </div>

        <div className="faq__item">
          <div className="faq__item-title">
            <p className="faq__text">相關法律權益</p>
          </div>
          <div className="faq__item-main">
            <p className="faq__text">
              1.會員同意之使用、交易或兌換行為，以本公司登載之電子資料為準，如有糾紛，則以該電子交易資料為準。
            </p>
            <p className="faq__text">
              2.如本公司依服務條款停用您的帳號，則您可能無法登入帳戶及存取您的帳戶資料、帳戶中所儲存之任何檔案、紅利、免運券、...等其他產品。
            </p>
            <p className="faq__text">
              3.本公司所推出之所有相關活動，均得視實際情況，保留活動終止及修改之權利。
            </p>
            <p className="faq__text">
              4.本服務條款之解釋與適用，以及與本服務條款有關或會員與本公司間因交易行為而產生之爭議或糾紛，悉依中華民國法律規定，並以臺灣士林地方法院為第一審管轄法院，但若法律對於管轄法院另有強制規定者，則從其規定。
            </p>
          </div>
        </div>
        <div className="faq__item">
          <div className="faq__item-title">
            <p className="faq__text">權利保留</p>
          </div>
          <div className="faq__item-main">
            <p className="faq__text">
              1.本公司保留最終會員註冊、訂單條件、商品兌換、調整相關商品或服務價格及修改本服務條款之權利，本公司擁有最終決定權。
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Faq;
