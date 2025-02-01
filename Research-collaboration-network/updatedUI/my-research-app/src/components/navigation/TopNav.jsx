'use client';

import { useState } from 'react';
import {
  AppBar,
  Box,
  IconButton,
  InputBase,
  Toolbar,
  Avatar,
  Menu,
  MenuItem,
  Typography
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function TopNav() {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    router.push('/auth/login');
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        bgcolor: '#161b22',
        borderBottom: '1px solid #30363d',
        boxShadow: 'none'
      }}
    >
      <Toolbar>
        <Box sx={{ 
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          bgcolor: '#0d1117',
          borderRadius: 1,
          border: '1px solid #30363d',
          p: '4px 8px',
          maxWidth: 400
        }}>
          <SearchIcon sx={{ color: '#8b949e', mr: 1 }} />
          <InputBase
            placeholder="Search..."
            sx={{ 
              color: '#c9d1d9',
              '& ::placeholder': {
                color: '#8b949e',
                opacity: 1
              },
              flexGrow: 1
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton sx={{ color: '#8b949e' }}>
            <NotificationsIcon />
          </IconButton>
          <IconButton sx={{ color: '#8b949e' }}>
            <SettingsIcon />
          </IconButton>
          <IconButton
            onClick={handleClick}
            sx={{ 
              p: 0,
              border: '1px solid #30363d',
              '&:hover': {
                border: '1px solid #2ea043'
              }
            }}
          >
            <Avatar 
              sx={{ 
                bgcolor: '#2ea043',
                width: 32,
                height: 32
              }}
            >
              U
            </Avatar>
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            sx: {
              bgcolor: '#161b22',
              border: '1px solid #30363d',
              color: '#c9d1d9',
              '& .MuiMenuItem-root': {
                '&:hover': {
                  bgcolor: 'rgba(46, 160, 67, 0.1)'
                }
              }
            }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => router.push('/profile')}>
            <Typography>Profile</Typography>
          </MenuItem>
          <MenuItem onClick={() => router.push('/settings')}>
            <Typography>Settings</Typography>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <Typography color="#f85149">Logout</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
} 