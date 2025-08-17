import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { TiWorld } from "react-icons/ti";

// React Icons
import {
  FiHome,
  FiUser,
  FiSettings,
  FiLogOut,
  FiUsers,
  FiStar,
  FiMessageSquare,
} from 'react-icons/fi';

const mainLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: <FiHome /> },
  { to: '/profile', label: 'Profile', icon: <FiUser /> },
  { to: '/settings', label: 'Settings', icon: <FiSettings /> },
];

const communityLinks = [
  { to: '/groups', label: 'Groups', icon: <FiUsers /> },
  { to: '/badges', label: 'Badges', icon: <FiStar /> },
  { to: '/messages', label: 'Messages', icon: <FiMessageSquare /> },
    { to: '/communityfeed', label: 'Community Feed', icon: <TiWorld /> },
];

export default function Sidebar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Logo */}
      <div className="text-3xl font-extrabold p-6 text-indigo-600 dark:text-indigo-400 select-none">
        DevHub
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col space-y-6 px-4 py-4 overflow-y-auto">
        {/* Main Links */}
        <div className="space-y-2">
          {mainLinks.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-600 dark:hover:text-white'
                }`
              }
            >
              <span className="text-lg">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </div>

        {/* Community Section */}
        <div className="space-y-2 pt-4 border-t border-gray-300 dark:border-gray-700">
          <p className="text-xs uppercase tracking-wider text-gray-400 px-4">
            Community
          </p>
          {communityLinks.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-600 dark:hover:text-white'
                }`
              }
            >
              <span className="text-lg">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </div>

        {/* Log Out Button */}
        <div className="mt-auto px-4 pt-6">
          <button
            onClick={handleLogOut}
            className=" font-medium w-full flex items-center gap-3 px-4
             py-3 rounded-lg text-red-600 dark:text-red-400
             hover:bg-red-100 dark:hover:bg-red-900 transition-all 
             duration-200 ease-linear cursor-pointer"
          >
            <FiLogOut className="text-lg" />
            <span>Log Out</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}