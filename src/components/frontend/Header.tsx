import React, { useEffect, useRef, useState } from 'react';
import logoImg from '@/assets/image/logo.png';
import { Link } from 'react-router-dom';
import {
  RiAwardLine,
  RiShieldStarLine,
  RiShoppingBagLine,
  RiSmartphoneLine,
  RiUserLine,
} from 'react-icons/ri';
import { IoCartOutline } from 'react-icons/io5';
import {
  FaBullhorn,
  FaCog,
  FaBars,
  FaUserCircle,
  FaGift,
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { clearAuthData } from '@/store/slices/frontend/authSlice';
import moment from 'moment';
import { getAllMarquees } from '@/services/frontend/marqueeService';
import SocialLinks from '../common/SocialLinks';
import { toggleSidebar } from '@/store/slices/frontend/uiSlice';
import DropdownMenu from '../common/DropdownMenu';
import { getUserInfo } from '@/services/frontend/userService';
import NumberFormatter from '../common/NumberFormatter';
import iconG from '@/assets/image/di-icon-g.png';
import iconS from '@/assets/image/di-icon-s.png';

const navItems = [
  {
    to: '/gamePrize',
    icon: <RiShieldStarLine />,
    label: '電玩賞',
    class: 'blue',
  },
  {
    to: '/3cPrize',
    icon: <RiSmartphoneLine />,
    label: '3C賞',
    class: 'blue',
  },
  {
    to: '/redPrize',
    icon: <RiAwardLine />,
    label: '紅利賞',
    class: 'blue',
  },
  {
    to: '/specialPrize',
    icon: <FaCog />,
    label: '優惠賞',
    class: 'red',
  },
  {
    to: '/news',
    icon: <FaBullhorn />,
    label: '最新消息',
    class: 'red',
  },
  {
    to: '/mallProduct',
    icon: <RiShoppingBagLine />,
    label: '商城',
    class: 'orange',
  },
  {
    to: '/cart',
    icon: <IoCartOutline />,
    label: '購物車',
    class: 'orange',
  },
  {
    to: '/deposit',
    icon: <IoCartOutline />,
    label: '儲值',
    class: 'orange',
  },
];

const Header = () => {
  const [userBalance, setUserBalance] = useState(0);
  const [userBonus, setUserBonus] = useState(0);
  const [userSliver, setUserSliver] = useState(0);

  const dispatch = useDispatch();
  const isLogin = useSelector(
    (state: RootState) => state.frontend.auth.isLogin
  );

  const siddeBarIsOpen = useSelector(
    (state: RootState) => state.frontend.ui.sidebarOpen
  );

  const handleLogout = () => {
    dispatch(clearAuthData());
  };

  const handleToggle = () => {
    dispatch(toggleSidebar());
  };

  const fetchUserInfo = async () => {
    try {
      const response = await getUserInfo();
      const { success, data, message } = response;

      if (success) {
        setUserBalance(data.balance || 0);
        setUserBonus(data.bonus || 0);
        setUserSliver(data.sliverCoin || 0);
      } else {
        console.error(`獲取用戶信息失敗：${message || '未知錯誤'}`);
      }
    } catch (error: any) {
      console.error('獲取用戶信息時發生錯誤：', error.message || '請稍後再試');
    }
  };

  useEffect(() => {
    if (isLogin) {
      fetchUserInfo();
    }
  }, [isLogin]);

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

  const processMarqueeData = async () => {
    try {
      const { success, data } = await getAllMarquees();
      if (success) {
        if (Object.keys(data).length > 0) {
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

  return (
    <div className="fheader">
      <div className="fheader__main">
        <div className="fheader__logo">
          <Link to="/main">
            <img src={logoImg} className="ffheader__logo-img" alt="Logo" />
          </Link>
        </div>
        <div className="fheader__menu" onClick={handleToggle}>
          <FaBars />
        </div>

        <div className="fheader__socials">
          <SocialLinks />
        </div>

        <div
          className={`fheader__nav ${
            siddeBarIsOpen ? 'fheader__nav--open' : ''
          }`}
          onClick={handleToggle}
        >
          <div className="fheader__nav-items">
            {navItems.map((item, index) => (
              <Link
                key={index}
                className={`fheader__nav-item fheader__nav-item--${item.class}`}
                to={item.to}
              >
                <div
                  className={`fheader__nav-item-icon fheader__nav-item-icon--${item.class}`}
                >
                  {item.icon}
                </div>
                {item.label}
              </Link>
            ))}

            {isLogin && (
              <>
                <div className="fheader__nav-item-divider"></div>
                <div className="fheader__nav-item fheader__nav-item--gold">
                  <div className="fheader__nav-item-icon">
                    <img src={iconG} alt="Gold Icon" />
                  </div>
                  <NumberFormatter number={userBalance} />
                </div>
                <div className="fheader__nav-item fheader__nav-item--sliver">
                  <div className="fheader__nav-item-icon">
                    <img src={iconS} alt="Silver Icon" />
                  </div>
                  <NumberFormatter number={userSliver} />
                </div>
                <div className="fheader__nav-item fheader__nav-item--bonus">
                  <div className="fheader__nav-item-icon">
                    <img src={iconS} alt="Silver Icon" />
                  </div>
                  <NumberFormatter number={userBonus} />
                </div>
                <Link
                  className="fheader__nav-item fheader__nav-item--member"
                  to="/member-center"
                >
                  <div className="fheader__nav-item-icon">
                    <RiUserLine />
                  </div>
                  會員中心
                </Link>
                <Link
                  className="fheader__nav-item fheader__nav-item--box"
                  to="/prizeBox"
                >
                  <div className="fheader__nav-item-icon">
                    <FaGift />
                  </div>
                  賞品盒
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="fheader__btns">
          {!isLogin ? (
            <Link className="fheader__btn fheader__btn--login" to="/login">
              登入/註冊
            </Link>
          ) : (
            <>
              <DropdownMenu
                coins={[
                  {
                    label: 'Gold Coins',
                    icon: 'G',
                    link: '#',
                    coins: userBalance,
                    className: 'gold',
                  },
                  {
                    label: 'Silver Coins',
                    icon: 'S',
                    link: '#',
                    coins: userSliver,
                    className: 'sliver',
                  },
                  {
                    label: 'Bonus Points',
                    icon: 'B',
                    link: '#',
                    coins: userBonus,
                    className: 'bonus',
                  },
                ]}
                links={[
                  {
                    label: '會員中心',
                    link: '/member-center',
                    className: 'custom-class-1',
                    icon: <FaUserCircle />,
                  },
                  {
                    label: '賞品盒子',
                    link: '/prizeBox',
                    className: 'custom-class-2',
                    icon: <FaGift />,
                  },
                ]}
                className="header"
                icon={<FaUserCircle />}
              />
            </>
          )}
        </div>
      </div>{' '}
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
