'use client';

import { Box } from '@mui/material';
import Sidebar from '@/components/navigation/Sidebar';
import TopNav from '@/components/navigation/TopNav';

export default function AppLayout({ children }) {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ 
        flexGrow: 1, 
        marginLeft: '240px',
        minHeight: '100vh',
        backgroundColor: '#0d1117'
      }}>
        <TopNav />
        {children}
      </Box>
    </Box>
  );
} 