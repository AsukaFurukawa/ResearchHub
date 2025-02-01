'use client';

import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import TeamsPageClient from './TeamsPageClient';

function LoadingSpinner() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <CircularProgress sx={{ color: '#2ea043' }} />
    </Box>
  );
}

export default function TeamsWrapper() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <TeamsPageClient />
    </Suspense>
  );
} 
