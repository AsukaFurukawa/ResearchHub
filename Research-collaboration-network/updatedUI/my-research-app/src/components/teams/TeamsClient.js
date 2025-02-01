'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import dynamic from 'next/dynamic';

// Dynamically import components that might cause hydration issues
const TeamsList = dynamic(() => import('@/components/dashboard/TeamsList'), {
  ssr: false,
  loading: () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
      <CircularProgress sx={{ color: '#2ea043' }} />
    </Box>
  )
});

const CreateTeamDialog = dynamic(() => import('@/components/teams/CreateTeamDialog'), {
  ssr: false
});

export default function TeamsClient() {
  const [mounted, setMounted] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress sx={{ color: '#2ea043' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: 3,
      minHeight: '100vh',
      bgcolor: '#0d1117'
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4
      }}>
        <Typography 
          variant="h4" 
          sx={{ 
            color: '#c9d1d9',
            fontWeight: 600
          }}
        >
          Research Teams
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsCreateDialogOpen(true)}
          sx={{
            bgcolor: '#238636',
            '&:hover': {
              bgcolor: '#2ea043'
            },
            textTransform: 'none',
            px: 3
          }}
        >
          Create Team
        </Button>
      </Box>

      <Box sx={{ maxWidth: '800px' }}>
        <TeamsList />
      </Box>

      {isCreateDialogOpen && (
        <CreateTeamDialog 
          open={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
        />
      )}
    </Box>
  );
} 