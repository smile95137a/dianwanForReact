import React, { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import { getAllMarquees } from '@/services/frontend/marqueeService';
import { FaBullhorn } from 'react-icons/fa';

interface MarqueeMessage {
  grade: string;
  name: string;
  createDate: string;
  shouldDisplay: boolean;
  username: string;
}

const Marquee = () => {
  const messages = [
    '歡迎光臨！',
    '促銷活動進行中！',
    '立即註冊獲得優惠！',
    '感謝您的支持！',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimate(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
        setAnimate(false);
      }, 500); // Match CSS animation duration
    }, 3000);

    return () => clearInterval(timer);
  }, [messages.length]);

  return (
    <>
      <div className={`marquee`}>
        <div className="marquee__logo">
          <FaBullhorn />
        </div>
        <div className="marquee__msg">
          <div className={`marquee__msg-main ${animate ? 'animate' : ''}`}>
            {messages[currentIndex]}
          </div>
        </div>
      </div>
    </>
  );
};

export default Marquee;
