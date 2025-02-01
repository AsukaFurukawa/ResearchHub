'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Group as GroupIcon,
  Description as ProjectIcon,
  Event as EventIcon,
  Message as MessageIcon,
  Science as ResearchIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon
} from '@mui/icons-material';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { path: '/dashboard', icon: <DashboardIcon />, text: 'Overview' },
    { path: '/projects', icon: <ProjectIcon />, text: 'Projects' },
    { path: '/teams', icon: <GroupIcon />, text: 'Teams' },
    { path: '/events', icon: <EventIcon />, text: 'Events' },
    { path: '/messages', icon: <MessageIcon />, text: 'Messages' },
    { path: '/research', icon: <ResearchIcon />, text: 'Research' },
  ];

  const bottomMenuItems = [
    { path: '/settings', icon: <SettingsIcon />, text: 'Settings' },
    { path: '/security', icon: <SecurityIcon />, text: 'Security' },
  ];

  const isActive = (path) => pathname === path;

  return (
    <Box
      sx={{
        width: 240,
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
      <Box sx={{ p: 3 }}>
        <Link href="/dashboard" style={{ textDecoration: 'none' }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              color: '#2ea043',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <ResearchIcon /> ResearchHub
          </Typography>
        </Link>
      </Box>

      <List sx={{ flex: 1, pt: 0 }}>
        {menuItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path}
            style={{ textDecoration: 'none' }}
            passHref
          >
            <ListItem
              sx={{
                color: isActive(item.path) ? '#2ea043' : '#8b949e',
                bgcolor: isActive(item.path) ? 'rgba(46, 160, 67, 0.1)' : 'transparent',
                '&:hover': {
                  bgcolor: isActive(item.path) ? 'rgba(46, 160, 67, 0.15)' : 'rgba(139, 148, 158, 0.1)',
                  color: isActive(item.path) ? '#2ea043' : '#c9d1d9'
                },
                borderRadius: 1,
                mb: 0.5,
                cursor: 'pointer'
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: isActive(item.path) ? 600 : 400
                }}
              />
            </ListItem>
          </Link>
        ))}
      </List>

      <List sx={{ pt: 0 }}>
        {bottomMenuItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path}
            style={{ textDecoration: 'none' }}
            passHref
          >
            <ListItem
              sx={{
                color: isActive(item.path) ? '#2ea043' : '#8b949e',
                bgcolor: isActive(item.path) ? 'rgba(46, 160, 67, 0.1)' : 'transparent',
                '&:hover': {
                  bgcolor: isActive(item.path) ? 'rgba(46, 160, 67, 0.15)' : 'rgba(139, 148, 158, 0.1)',
                  color: isActive(item.path) ? '#2ea043' : '#c9d1d9'
                },
                borderRadius: 1,
                mb: 0.5,
                cursor: 'pointer'
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: isActive(item.path) ? 600 : 400
                }}
              />
            </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  );
} 