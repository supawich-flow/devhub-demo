import React from "react";
import { CiSearch } from "react-icons/ci";
import { FiBell } from "react-icons/fi";
import DarkModeToggle from "../DarkModeToggle";
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { currentUser } = useAuth();

  return (
    <nav className="flex items-center justify-between px-6 md:px-8 py-4 bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
      {/* Left: Search Bar */}
      <div className="flex items-center space-x-4 flex-1">
        <div className="relative w-full md:w-96">
          <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xl" />
          <input
            type="text"
            placeholder="Search community..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
          />
        </div>
      </div>

      {/* Right: Icons & User */}
      <div className="flex items-center space-x-4">
        {/* Notification Icon */}
        <button className="relative text-gray-600 dark:text-gray-300 hover:text-indigo-500 transition">
          <FiBell className="text-xl cursor-pointer" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1 flex justify-center items-center">
            0
          </span>
        </button>

        {/* Dark Mode Toggle */}
        <DarkModeToggle />

        {/* User Avatar */}
        <div className="flex items-center gap-2">
          <img
            src={
              currentUser?.photoURL || "User"
            }
            alt="User avatar"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500"
          />
          <div className="hidden md:flex flex-col text-sm leading-tight">
            <span className="font-medium text-gray-800 dark:text-gray-100">
              {currentUser ? currentUser.displayName : "User"}
            </span>
            <div className="flex items-center gap-1">
              <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-green-600"></div>
              <span className="text-gray-500 dark:text-gray-400 text-xs">
              Online
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
