'use client';

import { AuthProvider } from '@/context/AuthContext';
import { Box } from '@mui/material';

export default function ClientLayout({ children }) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0d1117' }}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </Box>
  );
} 