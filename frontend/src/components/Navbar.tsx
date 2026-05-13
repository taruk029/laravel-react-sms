import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, User as UserIcon, LogIn, Bell } from 'lucide-react';
import axios from 'axios';
import API_CONFIG from '../config/api.config';
import { useNotifications } from '../context/NotificationContext';

const Navbar: React.FC = () => {
  const { user, token, logout } = useAuth();
  const { notifications, unreadCount, clearNotifications } = useNotifications();
  const [showNotifications, setShowNotifications] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      if (token) {
        await axios.post(`${API_CONFIG.baseUrl}/logout`);
      }
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      logout();
      navigate('/login');
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600">SMS<span className="text-gray-800">Hub</span></span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link to="/" className="border-transparent text-gray-500 hover:border-blue-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Home
              </Link>
              <a href="#pricing" className="border-transparent text-gray-500 hover:border-blue-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Pricing
              </a>
              <a href="#features" className="border-transparent text-gray-500 hover:border-blue-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Features
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="flex items-center text-gray-500 hover:text-gray-700 text-sm font-medium">
                  <LayoutDashboard className="w-4 h-4 mr-1" />
                  Dashboard
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative"
                  >
                    <Bell className="w-6 h-6" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold border-2 border-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                      <div className="py-1" role="menu" aria-orientation="vertical">
                        <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                          <span className="text-sm font-bold text-gray-900">Notifications</span>
                          <button onClick={clearNotifications} className="text-xs text-blue-600 hover:text-blue-500">Clear all</button>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="px-4 py-6 text-center text-sm text-gray-500">
                              No new notifications
                            </div>
                          ) : (
                            notifications.map((notif, idx) => (
                              <div key={idx} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0">
                                <div className="text-sm font-medium text-gray-900">{notif.title}</div>
                                <div className="text-xs text-gray-500 mt-1">{notif.message}</div>
                                <div className="text-[10px] text-gray-400 mt-1">{new Date(notif.timestamp).toLocaleTimeString()}</div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center text-sm text-gray-700 font-medium hidden sm:flex bg-gray-100 px-3 py-1 rounded-full">
                    <UserIcon className="w-4 h-4 mr-1" />
                    Hi, {user.name}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="flex items-center text-gray-500 hover:text-gray-700 text-sm font-medium">
                  <LogIn className="w-4 h-4 mr-1" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
