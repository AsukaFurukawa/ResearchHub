'use client';

import React, { useState } from 'react';
import { FiSearch, FiBell, FiChevronDown } from 'react-icons/fi';
import { usePathname } from 'next/navigation';

export default function TopNav() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/auth/login';
  };

  // Get the current page title based on pathname
  const getPageTitle = () => {
    const path = pathname.split('/')[1];
    return path.charAt(0).toUpperCase() + path.slice(1) || 'Overview';
  };

  return (
    <div className="h-16 bg-[#0d1117] border-b border-[#21262d] px-4 flex items-center justify-between">
      <div className="flex items-center flex-1">
        <h1 className="text-xl font-semibold text-[#c9d1d9]">{getPageTitle()}</h1>
        <div className="ml-8 flex-1 max-w-2xl">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b949e]" />
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg pl-10 pr-4 py-1.5 text-[#c9d1d9] placeholder-[#8b949e] focus:outline-none focus:border-[#3fb950]"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative text-[#8b949e] hover:text-[#c9d1d9]">
          <FiBell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#3fb950] text-white text-xs rounded-full flex items-center justify-center">
            4
          </span>
        </button>

        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-2 text-[#c9d1d9] hover:text-white"
          >
            <div className="w-8 h-8 rounded-full bg-[#238636] flex items-center justify-center">
              <span className="text-white font-medium">U</span>
            </div>
            <FiChevronDown className="w-4 h-4" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#161b22] border border-[#21262d] rounded-lg shadow-lg py-1">
              <a href="/profile" className="block px-4 py-2 text-sm text-[#c9d1d9] hover:bg-[#21262d]">
                Your Profile
              </a>
              <a href="/settings" className="block px-4 py-2 text-sm text-[#c9d1d9] hover:bg-[#21262d]">
                Settings
              </a>
              <div className="border-t border-[#21262d] my-1"></div>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-[#c9d1d9] hover:bg-[#21262d]"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
