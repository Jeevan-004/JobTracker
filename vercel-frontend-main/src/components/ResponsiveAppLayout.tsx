import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { Menu } from 'lucide-react';

const ResponsiveAppLayout = () => {
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div className="flex">
      <div className="hamburger-menu" onClick={toggleDrawer}>
        <Menu size={24} />
      </div>

      <div className={`slide-out-drawer ${isDrawerOpen ? 'open' : ''}`}>
        <Sidebar isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen} />
      </div>

      {isDrawerOpen && <div className="overlay open" onClick={toggleDrawer}></div>}

      <div className="sidebar-container fixed-sidebar">
        <Sidebar isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen} />
      </div>

      <main className="main-content flex-1">
        <div className="p-4">
          <Outlet />
        </div>
        {location.pathname === '/' && <Footer />}
      </main>
    </div>
  );
};

export default ResponsiveAppLayout;
