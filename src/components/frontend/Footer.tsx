import React from 'react';
import logoImg from '@/assets/image/logo.png';
import { Link } from 'react-router-dom';
import SocialLinks from '../common/SocialLinks';
const Footer = () => {
  return (
    <div className="footer">
      <div className="footer__container">
        <div className="footer__content">
          <div className="footer__logo">
            <div className="footer__logo-img">
              <img src={logoImg} />
            </div>
          </div>
          <div className="footer__main">
            <div className="footer__nav">
              <Link to="/about" className="footer__link">
                關於我們
              </Link>
              <Link to="/faq" className="footer__link">
                常見問題
              </Link>
              <Link to="/policy" className="footer__link">
                服務條款
              </Link>
              <Link to="/privacy" className="footer__link">
                隱私權政策
              </Link>
            </div>

            <div className="footer__other">
              <div className="footer__infos">
                <div className="footer__info">
                  <div className="footer__info-text">客服信箱：</div>
                  <div className="footer__info-text">abc@gmail.com</div>
                </div>
              </div>
              <div className="footer__socials">
                <SocialLinks />
              </div>
            </div>
          </div>
        </div>
        <div className="footer__footer">
          <p className="footer__text">
            @{new Date().getFullYear()} 電玩賞 版權所有
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
