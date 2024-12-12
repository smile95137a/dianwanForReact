import {
  FaBox,
  FaGift,
  FaNewspaper,
  FaStore,
  FaTruck,
  FaUsers,
} from 'react-icons/fa';
import SidebarItem from './SidebarItem';
import { HiOutlineClipboardList } from 'react-icons/hi';
import { MdOutlineRedeem } from 'react-icons/md';

const sidebarItems = [
  {
    icon: <FaUsers />,
    text: '會員管理',
    path: '/admin/main/member-management',
  },
  {
    icon: <FaBox />,
    text: '抽獎資料管理',
    path: '/admin/main/product-data-management',
  },
  {
    icon: <FaTruck />,
    text: '運輸方式管理',
    path: '/admin/main/shipment-management',
  },
  {
    icon: <FaStore />,
    text: '商城資料管理',
    path: '/admin/main/store-control',
  },
  {
    icon: <FaNewspaper />,
    text: '最新消息管理',
    path: '/admin/main/news-management',
  },
  {
    icon: <HiOutlineClipboardList />,
    text: '訂單狀態管理',
    path: '/admin/main/order-management',
  },
  { icon: <FaTruck />, text: '報表金額管理', path: '/admin/main/vendor' },
  {
    icon: <FaGift />,
    text: '推薦商品管理',
    path: '/admin/main/product-recommendation',
  },
  {
    icon: <FaNewspaper />,
    text: 'banner狀態管理',
    path: '/admin/main/banner-controler',
  },
  {
    icon: <MdOutlineRedeem />,
    text: '兌換碼管理',
    path: '/admin/main/redemptionCodeList',
  },
];

const Sidebar: React.FC = () => {
  return (
    <div className="bsidebar">
      <div className="bsidebar__main">
        <div className="bsidebar__items">
          {sidebarItems.map((item, index) => (
            <SidebarItem
              key={index}
              icon={item.icon}
              text={item.text}
              to={item.path}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
