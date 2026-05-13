import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { LayoutDashboard, Users as UsersIcon, Send, FileText, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['super_admin', 'admin', 'reseller', 'client'] },
    { name: 'Users', icon: UsersIcon, path: '/users', roles: ['super_admin', 'admin', 'reseller'] },
    { name: 'Send SMS', icon: Send, path: '#', roles: ['super_admin', 'admin', 'reseller', 'client'] },
    { name: 'Reports', icon: FileText, path: '#', roles: ['super_admin', 'admin', 'reseller', 'client'] },
    { name: 'Settings', icon: Settings, path: '#', roles: ['super_admin', 'admin', 'reseller', 'client'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    !item.roles || (user && item.roles.includes(user.role.slug))
  );

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow flex">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 shadow-sm sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
          <div className="flex-grow flex flex-col pt-5 pb-4">
            <nav className="mt-2 flex-1 px-3 space-y-1">
              {filteredMenuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`${
                    isActive(item.path)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200`}
                >
                  <item.icon
                    className={`${
                      isActive(item.path) ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    } mr-3 flex-shrink-0 h-5 w-5`}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
