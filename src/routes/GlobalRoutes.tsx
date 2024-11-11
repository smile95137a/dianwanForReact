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
import StoreControl from '@/pages/backend/StoreControl';
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
      { path: 'product', element: <Product /> },
      { path: 'product/:id', element: <ProductDetail /> },
      { path: 'mallProduct', element: <MallProduct /> },
      { path: 'mallProduct/:id', element: <MallProductDetail /> },
      { path: 'cart', element: <Cart /> },
      { path: 'orderSuccess', element: <OrderSuccess /> },
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
          { path: 'store-control', element: <StoreControl /> },
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

// Combine Routes
const GlobalRoutes: FC = () => {
  const routes = [
    ...FrontendRoutes,
    ...BackendRoutes,
    { path: '*', element: <Navigate to="/notfound" /> },
  ];

  const routing = useRoutes(routes);
  return routing;
};

export default GlobalRoutes;
