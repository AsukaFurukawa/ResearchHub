import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Typography
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Security as SecurityIcon
} from '@mui/icons-material';

export default function ProfileDropdown({ user }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      // Call backend logout endpoint if needed
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Clear local storage
      localStorage.removeItem('token');
      
      // Redirect to login
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still remove token and redirect even if backend call fails
      localStorage.removeItem('token');
      router.push('/auth/login');
    }
  };

  return (
    <Box>
      <IconButton onClick={handleClick} sx={{ p: 0 }}>
        <Avatar
          alt={user?.name || 'User Profile'}
          src={user?.avatar || '/default-avatar.png'}
          sx={{
            width: 40,
            height: 40,
            border: '2px solid #30363d',
            '&:hover': {
              borderColor: '#3fb950'
            }
          }}
        />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          sx: {
            bgcolor: '#161b22',
            border: '1px solid #30363d',
            color: '#c9d1d9',
            mt: 1.5,
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1,
              '&:hover': {
                bgcolor: 'rgba(63, 185, 80, 0.1)'
              }
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle1" sx={{ color: '#ffffff' }}>
            {user?.name || 'User'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#8b949e' }}>
            {user?.email || 'user@example.com'}
          </Typography>
        </Box>

        <Divider sx={{ borderColor: '#30363d' }} />

        <MenuItem onClick={() => router.push('/profile')}>
          <PersonIcon sx={{ mr: 2, fontSize: 20, color: '#8b949e' }} />
          Your Profile
        </MenuItem>

        <MenuItem onClick={() => router.push('/settings')}>
          <SettingsIcon sx={{ mr: 2, fontSize: 20, color: '#8b949e' }} />
          Settings
        </MenuItem>

        <MenuItem onClick={() => router.push('/security')}>
          <SecurityIcon sx={{ mr: 2, fontSize: 20, color: '#8b949e' }} />
          Security
        </MenuItem>

        <Divider sx={{ borderColor: '#30363d' }} />

        <MenuItem onClick={handleLogout} sx={{ color: '#f85149' }}>
          <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
} 