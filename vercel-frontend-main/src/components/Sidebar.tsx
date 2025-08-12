import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Briefcase, 
  FileText, 
  Search, 
  BarChart, 
  User,
  ChevronLeft,
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  
  const navigationItems = [
    { path: "/home", label: "Home", icon: Home },
    { path: "/job-tracker", label: "Job Tracker", icon: Briefcase },
    { path: "/resume-feedback", label: "AI Resume Feedback", icon: FileText },
    { path: "/jd-analysis", label: "JD Analysis", icon: Search },
    { path: "/analytics", label: "Analytics", icon: BarChart },
  ];

  const handleLogout = () => {
    logout(); // This will clear tokens and navigate to login
    toast.success("Logged out successfully!");
  };

  return (
    <div 
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col backdrop-blur-xl bg-jobwise-dark/80 border-r border-white/10 text-white transition-all duration-300 ease-in-out shadow-xl dark:from-gray-900 dark:to-gray-800",
        isOpen ? "w-64" : "w-20",
        !isOpen && "items-center",
        "lg:z-40",
        !isOpen && "lg:items-center"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
        <Link to="/home" className="flex items-center">
          {isOpen ? (
            <h1 className="font-heading text-xl font-bold tracking-wider text-white">
              JobWise AI
            </h1>
          ) : (
            <div className="w-8 h-8 rounded-full bg-jobwise-light flex items-center justify-center">
              <span className="font-heading text-sm font-bold text-jobwise-dark">JW</span>
            </div>
          )}
        </Link>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsOpen(!isOpen)}
          className="lg:flex hidden text-white hover:text-white hover:bg-white/10"
        >
          <ChevronLeft className={cn("h-5 w-5 transition-transform", !isOpen && "rotate-180")} />
        </Button>
      </div>

      <div className="flex-1 flex flex-col gap-1 px-2 py-4 overflow-y-auto">
        {navigationItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
              location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
                ? "bg-white/20 text-white shadow-md"
                : "text-white/70 hover:bg-white/10 hover:text-white",
              !isOpen && "justify-center px-2"
            )}
          >
            <item.icon className={cn("flex-shrink-0", isOpen ? "h-5 w-5" : "h-6 w-6")} />
            {isOpen && <span className="text-white">{item.label}</span>}
          </Link>
        ))}
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center justify-between mb-4">
          {isOpen ? (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="w-full text-white hover:text-white hover:bg-white/10 px-3"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout}
              className="text-white hover:text-white hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div 
          className={cn(
            "flex items-center gap-3",
            !isOpen && "justify-center"
          )}
        >
          <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          {isOpen && (
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">{user?.name || "User"}</span>
              <span className="text-xs text-white/70">{user?.email || "user@example.com"}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
