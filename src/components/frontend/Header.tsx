import React, { useEffect, useRef, useState } from 'react';
import logoImg from '@/assets/image/logo.png';
import { Link } from 'react-router-dom';
import {
  RiShieldStarLine,
  RiShoppingBagLine,
  RiUserLine,
} from 'react-icons/ri';
import { IoCartOutline } from 'react-icons/io5';
import { FaToolbox, FaBullhorn } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { clearAuthData } from '@/store/slices/frontend/authSlice';
import moment from 'moment';
import { getAllMarquees } from '@/services/frontend/marqueeService';

const navItems = [
  { to: '/product', icon: <RiShieldStarLine />, label: '電玩賞' },
  { to: '/news', icon: <FaBullhorn />, label: '最新消息' },
  { to: '/mallProduct', icon: <RiShoppingBagLine />, label: '商城' },
  { to: '/prizeBox', icon: <FaToolbox />, label: '賞品盒' },
  { to: '/cart', icon: <IoCartOutline />, label: '購物車' },
];

const Header = () => {
  const dispatch = useDispatch();
  const isLogin = useSelector(
    (state: RootState) => state.frontend.auth.isLogin
  );

  //
  const [isSticky, setIsSticky] = useState(false);
  const [marqueeMessageData, setMarqueeMessageData] = useState<any[]>([]);
  const marqueeInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const threshold = 100;
      setIsSticky(window.scrollY >= threshold);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    dispatch(clearAuthData());
  };

  const processMarqueeData = async () => {
    try {
      const { success, data } = await getAllMarquees();
      if (success) {
        const currentTime = moment();

        const result = Object.keys(data).map((key) =>
          data[key].map((marquee: any) => {
            const createDate = moment(marquee.createDate);
            const updatedDate = createDate.add(60, 'seconds');
            const shouldDisplay = updatedDate.isAfter(currentTime);
            return {
              ...marquee,
              shouldDisplay,
            };
          })
        );

        const transformedData = result.map((group) => {
          const title = group[0]?.username;
          return {
            title,
            list: group,
          };
        });

        const filteredGroup = transformedData.filter(
          (x) => x.list.length > 0 && x.list[0].shouldDisplay
        );

        const lastData =
          filteredGroup.length === 0
            ? [transformedData[transformedData.length - 1]]
            : filteredGroup;

        setMarqueeMessageData(lastData);
      } else {
        console.error('Unable to fetch marquee data or request failed');
      }
    } catch (error) {
      console.error('Failed to fetch marquee data:', error);
    }
  };

  useEffect(() => {
    processMarqueeData();

    marqueeInterval.current = setInterval(() => {
      processMarqueeData();
    }, 20000);

    return () => {
      if (marqueeInterval.current) {
        clearInterval(marqueeInterval.current);
      }
    };
  }, []);

  const calculateAnimationDuration = () => {
    const textList = marqueeMessageData.map((x: any) =>
      x.list.map(({ grade, name }: any) => `${grade}賞 ${name}`).join(' 和 ')
    );
    const concatenatedText = textList.join('');
    const textLength = concatenatedText.length;

    const targetSpeed = 100;
    const containerWidth = window.innerWidth;

    const totalDistance = Math.max(containerWidth, textLength * 10);
    const duration = totalDistance / targetSpeed;

    return `${duration}s`;
  };

  const getColor = (index: number) => {
    const colors = ['#5889ff', '#ff7b58'];
    return colors[index % colors.length];
  };

  const getMarqueeMsg = (list: any[]) => {
    return list.map(({ grade, name }) => `${grade}賞 ${name}`).join(' 和 ');
  };

  return (
    <div className="fheader">
      <div className="fheader__logo">
        <Link to="/main">
          <img src={logoImg} className="ffheader__logo-img" alt="Logo" />
        </Link>
      </div>

      <div className="fheader__nav">
        <div className="fheader__nav-items">
          {navItems.map((item, index) => (
            <Link key={index} className="fheader__nav-item" to={item.to}>
              <div className="fheader__nav-item-icon">{item.icon}</div>
              {item.label}
            </Link>
          ))}
          {isLogin && (
            <Link className="fheader__nav-item" to="/member-center">
              <div className="fheader__nav-item-icon">
                <RiUserLine />
              </div>
              會員中心
            </Link>
          )}
        </div>
      </div>

      <div className="fheader__btns">
        {!isLogin ? (
          <Link className="fheader__btn fheader__btn--login" to="/login">
            登入/註冊
          </Link>
        ) : (
          <div
            className="fheader__btn fheader__btn--login"
            onClick={handleLogout}
          >
            登出
          </div>
        )}
      </div>

      {marqueeMessageData.length > 0 && (
        <div
          className={`fheader__marquee ${
            isSticky ? 'fheader__marquee--sticky' : ''
          }`}
        >
          <p
            className="fheader__text"
            style={{ animationDuration: calculateAnimationDuration() }}
          >
            {marqueeMessageData.map((item, index) => (
              <span key={index}>
                🎉恭喜🎉
                <span style={{ color: getColor(0), fontWeight: 'bold' }}>
                  {item.title}
                </span>
                中獎 中獎的獎項為
                <span style={{ color: getColor(1), fontWeight: 'bold' }}>
                  {getMarqueeMsg(item.list)}
                </span>
                請大家一起恭喜他 ~
              </span>
            ))}
          </p>
        </div>
      )}
    </div>
  );
};

export default Header;
