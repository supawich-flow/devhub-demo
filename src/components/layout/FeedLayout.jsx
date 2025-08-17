import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function FeedLayout() {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <Sidebar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
    </div>
  );
}