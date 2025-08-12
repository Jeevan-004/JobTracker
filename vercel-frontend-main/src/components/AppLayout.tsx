
import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Close sidebar by default on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  // Only show footer on the landing page
  const shouldShowFooter = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gradient-to-br from-jobwise-dark to-black text-white flex">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-h-screen relative lg:ml-64 transition-all duration-300 ease-in-out">
        {/* Mobile Menu Button */}
        <div className="lg:hidden absolute top-4 left-4 z-50">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-black/50 hover:bg-black/80 backdrop-blur-sm text-white"
          >
            <Menu className="h-5 w-5 text-white" />
          </Button>
        </div>
        
        <main className="flex-1 overflow-auto p-4 md:p-6 pt-14 sm:pt-4 md:pt-6 lg:pt-6">
          {/* Add a CSS class to the Outlet that will be applied to all pages */}
          <div className="job-tiles-container">
            <Outlet />
          </div>
        </main>
        
        {shouldShowFooter && <Footer />}
      </div>
    </div>
  );
};

export default AppLayout;
