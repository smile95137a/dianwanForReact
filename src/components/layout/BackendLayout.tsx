import React, { FC } from 'react';
import { Outlet } from 'react-router-dom';

const BackendLayout: FC = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default BackendLayout;
