import React from 'react';
import logoImg from '@/assets/image/logo.png';
const About = () => {
  return (
    <>
      <div className="about">
        <div className="about__title">
          <p className="about__text">
            <span className="about__text about__text--highlight">電玩賞</span>
            是全臺灣最有公信力的線上一番賞抽獎平台，
            <p>
              我們最大的特色就是：公平、公正、公開、透明，本平台經由第三方非營利組織
              <span className="about__text about__text--highlight">
                OOOOOOOOOOO
              </span>
              嚴格監督，絕無任何詐欺消費者之可能，保證不玄不漲價。
              <p>
                <span className="about__text about__text--highlight">
                  OOOOOOOOOOO
                </span>
                嚴格監督，絕無任何詐欺消費者之可能，保證不玄不漲價。
              </p>
            </p>
          </p>
        </div>
        <div className="about__content">
          <p className="about__text about__text--title">
            來<span className="about__text about__text--highlight">電玩賞</span>
            您將享受到~
          </p>
          <p className="about__text">1.公平、公正、公開、透明的消費。</p>
          <p className="about__text">2.我們賞品獎項最豐富。</p>
          <p className="about__text">3.一次消費，多重中獎機會。</p>
          <p className="about__text">4.會員多重好福利-免費代幣領不完。</p>
          <p className="about__text">5.超常態加碼抽獎活動，獎品超豐富。</p>
          <p className="about__text">
            6.獨家
            <span className="about__text about__text--highlight">
              客製化專區
            </span>
            ，為您打造專屬抽獎。
          </p>
        </div>

        <div className="about__company">
          <div className="about__company-logo">
            <img src={logoImg} className="about__company-img" alt="Logo" />
          </div>
          <div className="about__company-info">
            <p className="about__text">
              <span className="about__text about__text--highlight">
                公司名稱：
              </span>
              電玩賞娛樂有限公司
            </p>
            <p className="about__text">
              <span className="about__text about__text--highlight">
                公司統編：
              </span>
              90909
            </p>
            <p className="about__text">
              <span className="about__text about__text--highlight">
                公司信箱：
              </span>
              @gmail.com
            </p>
            <p className="about__text">
              <span className="about__text about__text--highlight">
                官方LINE：
              </span>
              @XXX
            </p>
            <p className="about__text">
              <span className="about__text about__text--highlight">
                客服服務時間：
              </span>
              09:00~17:00
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
