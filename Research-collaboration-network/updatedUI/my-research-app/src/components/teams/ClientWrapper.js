'use client';

import dynamic from 'next/dynamic';
import { Box, CircularProgress } from '@mui/material';

const TeamsWrapper = dynamic(() => import('./TeamsWrapper'), {
  ssr: false,
  loading: () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <CircularProgress sx={{ color: '#2ea043' }} />
    </Box>
  )
});

export default function ClientWrapper() {
  return <TeamsWrapper />;
} 