import Header from '@/components/backend/Header';
import Sidebar from '@/components/backend/Sidebar';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const Main = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const validateUser = async () => {
      try {
        const token = localStorage.getItem('btoken');
        if (!token) {
          navigate('/admin/login');
        }
      } catch (error) {
        console.error('驗證失敗:', error);
        navigate('/admin/login');
      }
    };

    validateUser();
  }, [navigate]);

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
