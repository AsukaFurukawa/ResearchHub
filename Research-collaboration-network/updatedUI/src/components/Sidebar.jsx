import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="w-64 min-h-screen bg-[#0d1117] border-r border-[#30363d] flex flex-col">
      {/* User Section */}
      <div className="p-4">
        <Link to="/dashboard" className="flex items-center mb-6">
          <img src="/user-placeholder.png" alt="User" className="w-14 h-14 rounded-full mr-3" />
          <div>
            <div className="text-white font-semibold">Loading...</div>
            <div className="text-sm text-[#8b949e]">Loading...</div>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow space-y-1 px-4">
        <Link
          to="/dashboard"
          className="flex items-center px-3 py-2 text-[#8b949e] hover:text-white hover:bg-[#21262d] rounded transition-colors duration-200"
        >
          <span className="material-icons mr-2">dashboard</span>
          <span>Dashboard</span>
        </Link>

        <Link
          to="/news-feed"
          className="flex items-center px-3 py-2 text-[#8b949e] hover:text-white hover:bg-[#21262d] rounded transition-colors duration-200"
        >
          <span className="material-icons mr-2">feed</span>
          <span>News Feed</span>
        </Link>

        <Link
          to="/events"
          className="flex items-center px-3 py-2 text-[#8b949e] hover:text-white hover:bg-[#21262d] rounded transition-colors duration-200"
        >
          <span className="material-icons mr-2">event</span>
          <span>Events & Conferences</span>
        </Link>

        <Link
          to="/teams"
          className="flex items-center px-3 py-2 text-[#8b949e] hover:text-white hover:bg-[#21262d] rounded transition-colors duration-200"
        >
          <span className="material-icons mr-2">group</span>
          <span>Teams</span>
        </Link>

        <Link
          to="/projects"
          className="flex items-center px-3 py-2 text-[#8b949e] hover:text-white hover:bg-[#21262d] rounded transition-colors duration-200"
        >
          <span className="material-icons mr-2">book</span>
          <span>Projects & Papers</span>
        </Link>

        <Link
          to="/settings"
          className="flex items-center px-3 py-2 text-[#8b949e] hover:text-white hover:bg-[#21262d] rounded transition-colors duration-200"
        >
          <span className="material-icons mr-2">settings</span>
          <span>Settings</span>
        </Link>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-[#30363d]">
        <button
          onClick={handleLogout}
          className="flex items-center px-3 py-2 w-full text-[#8b949e] hover:text-white hover:bg-[#21262d] rounded transition-colors duration-200"
        >
          <span className="material-icons mr-2">logout</span>
          <span>Logout</span>
        </button>
      </div>

      {/* Stats Section */}
      <div className="p-4 border-t border-[#30363d]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center text-[#8b949e]">
            <span className="material-icons text-sm mr-1">notifications</span>
            <span>4</span>
          </div>
          <div className="flex items-center text-[#8b949e]">
            <span className="material-icons text-sm mr-1">mail</span>
            <span>2</span>
          </div>
        </div>
        <div className="flex items-center text-[#8b949e]">
          <img src="/user-placeholder.png" alt="User" className="w-8 h-8 rounded-full mr-2" />
          <span>Dr. Jane Doe</span>
        </div>
      </div>
    </div>
  );
} 