import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Home, Briefcase, FileText, BarChart2, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ setIsOpen }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/home', icon: <Home size={20} />, text: 'Home' },
    { to: '/job-tracker', icon: <Briefcase size={20} />, text: 'Job Tracker' },
    { to: '/resume-feedback', icon: <FileText size={20} />, text: 'AI Resume Feedback' },
    { to: '/jd-analysis', icon: <Search size={20} />, text: 'JD Analysis' },
    { to: '/analytics', icon: <BarChart2 size={20} />, text: 'Analytics' },
  ];

  return (
    <div className="flex flex-col h-full p-4 bg-[#2A2A72] text-white">
      <div className="mb-10">
        <h2 className="text-2xl font-bold">JobWise AI</h2>
      </div>
      <nav className="flex-grow">
        <ul>
          {navLinks.map((link) => (
            <li key={link.to} className="mb-2">
              <Link
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={`flex items-center p-3 rounded-lg text-sm transition-colors ${
                  location.pathname.startsWith(link.to)
                    ? 'bg-[#4E4E91]'
                    : 'hover:bg-[#3E3E81]'
                }`}
              >
                {link.icon}
                <span className="ml-4 font-medium">{link.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t border-gray-500 pt-4">
        {user && (
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center font-bold text-xl">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="ml-3">
              <p className="font-semibold text-sm">{user.name}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-3 rounded-lg text-sm hover:bg-[#3E3E81] transition-colors"
        >
          <LogOut size={20} />
          <span className="ml-4 font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
