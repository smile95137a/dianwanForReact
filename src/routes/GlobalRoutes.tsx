import BackendLayout from '@/components/layout/BackendLayout';
import FrontendLayout from '@/components/layout/FrontendLayout';
import FLogin from '@/pages/frontend/Login';
import BLogin from '@/pages/backend/Login';
import FMain from '@/pages/frontend/Main';
import BMain from '@/pages/backend/Main';
import NotFound from '@/pages/frontend/NotFound';
import Product from '@/pages/frontend/Product';
import Register from '@/pages/frontend/Register';
import { FC } from 'react';
import { RouteObject, Navigate, useRoutes } from 'react-router-dom';
import MemberManagement from '@/pages/backend/MemberManagement';
import NewsManagement from '@/pages/backend/NewsManagement';
import OrderManagement from '@/pages/backend/OrderManagement';
import ProductRecommendation from '@/pages/backend/ProductRecommendation';
import RedemptionCodeList from '@/pages/backend/RedemptionCodeList';
import ShipmentManagement from '@/pages/backend/ShipmentManagement';
import StoreManagement from '@/pages/backend/StoreManagement';
import VendorManagement from '@/pages/backend/VendorManagement';
import ProductDataManagement from '@/pages/backend/ProductDataManagement';
import BannerManagement from '@/pages/backend/BannerManagement';
import { BackendDialogProvider } from '@/context/backend/BackendDialogProvider';
import ProductDetail from '@/pages/frontend/ProductDetail';
import MallProduct from '@/pages/frontend/MallProduct';
import MallProductDetail from '@/pages/frontend/MallProductDetail';
import { FrontendDialogProvider } from '@/context/frontend/FrontendDialogProvider';
import Cart from '@/pages/frontend/Cart';
import OrderSuccess from '@/pages/frontend/OrderSuccess';
import MemberCenter from '@/pages/frontend/memberCenter/MemberCenter';
import OrderHistory from '@/pages/frontend/memberCenter/OrderHistory';
import Rewards from '@/pages/frontend/memberCenter/Rewards';
import ProfileEdit from '@/pages/frontend/memberCenter/ProfileEdit';
import PurchaseHistory from '@/pages/frontend/memberCenter/PurchaseHistory';
import NewsDetail from '@/pages/frontend/NewsDetail';
import News from '@/pages/frontend/News';
import About from '@/pages/frontend/About';
import Faq from '@/pages/frontend/Faq';
import Policy from '@/pages/frontend/Policy';
import Privacy from '@/pages/frontend/Privacy';
import ScrollToTop from '@/components/common/ScrollToTop';
import { LoadingProvider } from '@/context/frontend/LoadingContext';
import PrizeBox from '@/pages/frontend/PrizeBox';
import RestPwd from '@/pages/frontend/RestPwd';
import Product3C from '@/pages/frontend/Product3C';
import ProductRedPrize from '@/pages/frontend/ProductRedPrize';

const FrontendRoutes: RouteObject[] = [
  {
    path: '/',
    element: (
      <FrontendDialogProvider>
        <FrontendLayout />
      </FrontendDialogProvider>
    ),
    children: [
      { path: 'login', element: <FLogin /> },
      { path: 'register', element: <Register /> },
      { path: 'main', element: <FMain /> },
      { path: 'gamePrize', element: <Product /> },
      { path: '3cPrize', element: <Product3C /> },
      { path: 'redPrize', element: <ProductRedPrize /> },
      { path: 'product/:id', element: <ProductDetail /> },
      { path: 'mallProduct', element: <MallProduct /> },
      { path: 'mallProduct/:id', element: <MallProductDetail /> },
      { path: 'cart', element: <Cart /> },
      { path: 'prizeBox', element: <PrizeBox /> },
      { path: 'orderSuccess', element: <OrderSuccess /> },
      {
        path: 'member-center',
        element: <MemberCenter />,
        children: [
          { path: '', element: <Navigate to="profile-edit" /> },
          { path: 'order-history', element: <OrderHistory /> },
          { path: 'profile-edit', element: <ProfileEdit /> },
          { path: 'purchase-history', element: <PurchaseHistory /> },
          { path: 'rewards', element: <Rewards /> },
        ],
      },
      { path: 'news', element: <News /> },
      { path: 'news/:newsUid', element: <NewsDetail /> },
      { path: 'about', element: <About /> },
      { path: 'faq', element: <Faq /> },
      { path: 'policy', element: <Policy /> },
      { path: 'privacy', element: <Privacy /> },
      { path: 'restPwd', element: <RestPwd /> },
      { path: 'notfound', element: <NotFound /> },
      { path: '', element: <Navigate to="main" /> },
    ],
  },
];

const BackendRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: (
      <BackendDialogProvider>
        <BackendLayout />
      </BackendDialogProvider>
    ),
    children: [
      { path: 'login', element: <BLogin /> },
      {
        path: 'main',
        element: <BMain />,
        children: [
          { path: 'member-management', element: <MemberManagement /> },
          {
            path: 'product-data-management',
            element: <ProductDataManagement />,
          },
          { path: 'shipment-management', element: <ShipmentManagement /> },
          { path: 'store-control', element: <StoreManagement /> },
          { path: 'news-management', element: <NewsManagement /> },
          { path: 'order-management', element: <OrderManagement /> },
          { path: 'vendor', element: <VendorManagement /> },
          {
            path: 'product-recommendation',
            element: <ProductRecommendation />,
          },
          { path: 'banner-controler', element: <BannerManagement /> },
          { path: 'redemptionCodeList', element: <RedemptionCodeList /> },
          { path: '', element: <Navigate to="member-management" /> }, // Default to member management
        ],
      },
      { path: '', element: <Navigate to="login" /> },
    ],
  },
  { path: '/admin/*', element: <Navigate to="/notfound" /> },
];

const GlobalRoutes: FC = () => {
  const routes = [
    ...FrontendRoutes,
    ...BackendRoutes,
    { path: '*', element: <Navigate to="/notfound" /> },
  ];

  return (
    <>
      <LoadingProvider>
        <ScrollToTop />
        {useRoutes(routes)}
      </LoadingProvider>
    </>
  );
};
export default GlobalRoutes;
