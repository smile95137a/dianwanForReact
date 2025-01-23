import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearAuthData } from '@/store/slices/backend/authSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutFn = () => {
    // 清除 Redux 中的授權資料
    dispatch(clearAuthData());

    // 可選：清除其他本地儲存資料，例如 localStorage
    localStorage.removeItem('accessToken');

    // 導向登入頁面
    navigate('/admin');
  };

  return (
    <div className="bheader">
      <div className="bheader__logo"></div>
      <div className="bheader__options">
        <div className="bheader__user">
          <div className="bheader__user-info"></div>
        </div>
        <button onClick={logoutFn} className="bheader__logout-btn">
          登出
        </button>
      </div>
    </div>
  );
};

export default Header;
