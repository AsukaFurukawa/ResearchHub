import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiSettings, FiFolder, FiUsers, FiLogOut } from 'react-icons/fi';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <img
          src={user?.avatar || 'https://via.placeholder.com/40'}
          alt="Profile"
          className="w-10 h-10 rounded-full border-2 border-gray-700"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-700">
            <p className="text-sm text-gray-200 font-semibold">
              {user?.fullName || `${user?.firstName} ${user?.lastName}`}
            </p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>

          <button
            onClick={() => navigate('/profile')}
            className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center space-x-2"
          >
            <FiUser className="text-gray-400" />
            <span>Your Profile</span>
          </button>

          <button
            onClick={() => navigate('/settings')}
            className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center space-x-2"
          >
            <FiSettings className="text-gray-400" />
            <span>Settings</span>
          </button>

          <button
            onClick={() => navigate('/projects')}
            className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center space-x-2"
          >
            <FiFolder className="text-gray-400" />
            <span>My Projects</span>
          </button>

          <button
            onClick={() => navigate('/teams')}
            className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center space-x-2"
          >
            <FiUsers className="text-gray-400" />
            <span>My Teams</span>
          </button>

          <div className="border-t border-gray-700 mt-1">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700 flex items-center space-x-2"
            >
              <FiLogOut className="text-red-400" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown; 