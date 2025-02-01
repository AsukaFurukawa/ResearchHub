import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Collapse,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assignment as ProjectIcon,
  Event as EventIcon,
  Message as MessageIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  ExpandLess,
  ExpandMore,
  Science as ScienceIcon,
} from '@mui/icons-material';

export default function Sidebar() {
  const router = useRouter();
  const [openMenus, setOpenMenus] = useState({});

  const handleMenuClick = (menuKey) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const menuItems = [
    {
      icon: <DashboardIcon />,
      text: 'Overview',
      path: '/overview'
    },
    {
      icon: <ProjectIcon />,
      text: 'Projects',
      path: '/projects'
    },
    {
      icon: <PeopleIcon />,
      text: 'Teams',
      path: '/teams'
    },
    {
      icon: <EventIcon />,
      text: 'Events',
      path: '/events'
    },
    {
      icon: <MessageIcon />,
      text: 'Messages',
      path: '/messages'
    },
    {
      icon: <ScienceIcon />,
      text: 'Research',
      path: '/research'
    }
  ];

  const bottomMenuItems = [
    {
      icon: <SettingsIcon />,
      text: 'Settings',
      path: '/settings'
    },
    {
      icon: <SecurityIcon />,
      text: 'Security',
      path: '/security'
    }
  ];

  const MenuItem = ({ item }) => {
    const isActive = router.pathname === item.path;

    return (
      <ListItem
        button
        onClick={() => router.push(item.path)}
        sx={{
          borderRadius: 1,
          mb: 0.5,
          color: isActive ? '#3fb950' : '#8b949e',
          '&:hover': {
            bgcolor: 'rgba(63, 185, 80, 0.1)',
            color: '#3fb950',
            '& .MuiListItemIcon-root': {
              color: '#3fb950'
            }
          }
        }}
      >
        <ListItemIcon sx={{ color: isActive ? '#3fb950' : '#8b949e', minWidth: 40 }}>
          {item.icon}
        </ListItemIcon>
        <ListItemText 
          primary={item.text}
          primaryTypographyProps={{
            fontSize: '0.9rem',
            fontWeight: isActive ? 600 : 400
          }}
        />
      </ListItem>
    );
  };

  return (
    <Box
      sx={{
        width: 260,
        flexShrink: 0,
        bgcolor: '#161b22',
        borderRight: '1px solid #30363d',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1200,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Logo */}
      <Box sx={{ p: 3, borderBottom: '1px solid #30363d' }}>
        <Typography
          variant="h5"
          sx={{
            color: '#3fb950',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <ScienceIcon /> ResearchHub
        </Typography>
      </Box>

      {/* Main Menu */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        <List>
          {menuItems.map((item, index) => (
            <MenuItem key={index} item={item} />
          ))}
        </List>
      </Box>

      {/* Bottom Menu */}
      <Box sx={{ p: 2, borderTop: '1px solid #30363d' }}>
        <List>
          {bottomMenuItems.map((item, index) => (
            <MenuItem key={index} item={item} />
          ))}
        </List>
      </Box>
    </Box>
  );
} 