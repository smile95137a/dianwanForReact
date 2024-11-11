import React, { FC } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../frontend/Header';
import Footer from '../frontend/Footer';
const FrontendLayout: FC = () => {
  return (
    <div className="frontLayout">
      <Header />
      <main className="frontLayout__main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default FrontendLayout;
