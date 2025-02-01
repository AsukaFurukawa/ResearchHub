'use client';

import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import TeamsList from '@/components/dashboard/TeamsList';
import CreateTeamDialog from '@/components/teams/CreateTeamDialog';

const TeamsPageClient = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

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
};

export default TeamsPageClient; 
