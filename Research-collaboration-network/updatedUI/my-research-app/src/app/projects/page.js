'use client';

import { Box, Typography } from '@mui/material';
import ProjectCard from '@/components/dashboard/ProjectCard';

export default function ProjectsPage() {
  return (
    <Box sx={{ 
      p: 3,
      minHeight: '100vh',
      bgcolor: '#0d1117'
    }}>
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 4,
          color: '#c9d1d9',
          fontWeight: 600
        }}
      >
        Research Projects
      </Typography>

      <Box sx={{ maxWidth: '800px' }}>
        <ProjectCard />
      </Box>
    </Box>
  );
} 