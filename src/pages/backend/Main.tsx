import Header from '@/components/backend/Header';
import Sidebar from '@/components/backend/Sidebar';
import { Outlet } from 'react-router-dom';

const Main = () => {
  return (
    <div className="dashboard">
      <Header />
      <div className="dashboard__layout">
        <Sidebar />
        <div className="dashboard__main">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Main;
