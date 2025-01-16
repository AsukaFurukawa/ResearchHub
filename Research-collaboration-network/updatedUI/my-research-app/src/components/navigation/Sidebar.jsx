import { useState } from 'react';
import { useRouter } from 'next/router';
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
      path: '/dashboard'
    },
    {
      icon: <ProjectIcon />,
      text: 'Projects',
      path: '/projects',
      submenu: [
        { text: 'All Projects', path: '/projects' },
        { text: 'Create New', path: '/projects/new' },
        { text: 'Categories', path: '/projects/categories' }
      ]
    },
    {
      icon: <PeopleIcon />,
      text: 'Teams',
      path: '/teams',
      submenu: [
        { text: 'My Teams', path: '/teams' },
        { text: 'Create Team', path: '/teams/new' },
        { text: 'Invitations', path: '/teams/invitations' }
      ]
    },
    {
      icon: <EventIcon />,
      text: 'Events',
      path: '/events',
      submenu: [
        { text: 'Conferences', path: '/events/conferences' },
        { text: 'Workshops', path: '/events/workshops' },
        { text: 'Calendar', path: '/events/calendar' }
      ]
    },
    {
      icon: <MessageIcon />,
      text: 'Messages',
      path: '/messages'
    },
    {
      icon: <ScienceIcon />,
      text: 'Research',
      path: '/research',
      submenu: [
        { text: 'Papers', path: '/research/papers' },
        { text: 'Datasets', path: '/research/datasets' },
        { text: 'Citations', path: '/research/citations' }
      ]
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
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isOpen = openMenus[item.text];
    const isActive = router.pathname === item.path;

    return (
      <>
        <ListItem
          button
          onClick={() => hasSubmenu ? handleMenuClick(item.text) : router.push(item.path)}
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
          {hasSubmenu && (isOpen ? <ExpandLess /> : <ExpandMore />)}
        </ListItem>

        {hasSubmenu && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.submenu.map((subItem, index) => (
                <ListItem
                  key={index}
                  button
                  onClick={() => router.push(subItem.path)}
                  sx={{
                    pl: 7,
                    borderRadius: 1,
                    mb: 0.5,
                    color: router.pathname === subItem.path ? '#3fb950' : '#8b949e',
                    '&:hover': {
                      bgcolor: 'rgba(63, 185, 80, 0.1)',
                      color: '#3fb950'
                    }
                  }}
                >
                  <ListItemText
                    primary={subItem.text}
                    primaryTypographyProps={{
                      fontSize: '0.85rem',
                      fontWeight: router.pathname === subItem.path ? 600 : 400
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Collapse>
        )}
      </>
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
        position: 'sticky',
        top: 0,
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