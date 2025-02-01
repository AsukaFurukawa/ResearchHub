'use client';

import { Box, Typography, LinearProgress, Chip, Avatar, AvatarGroup } from '@mui/material';
import { useRouter } from 'next/router';
import {
  Description as DescriptionIcon,
  Group as GroupIcon,
  DataObject as DataObjectIcon
} from '@mui/icons-material';

const projects = [
  {
    id: 1,
    title: 'AI Research Paper',
    type: 'Research',
    progress: 75,
    team: [
      { name: 'John Doe', initials: 'JD' },
      { name: 'Jane Smith', initials: 'JS' },
      { name: 'Mike Johnson', initials: 'MJ' }
    ]
  },
  {
    id: 2,
    title: 'Data Analysis Project',
    type: 'Analysis',
    progress: 45,
    team: [
      { name: 'Sarah Wilson', initials: 'SW' },
      { name: 'Tom Brown', initials: 'TB' }
    ]
  }
];

export default function ProjectCard() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {projects.map((project) => (
        <Box
          key={project.id}
          sx={{
            bgcolor: '#0d1117',
            borderRadius: 1,
            p: 2,
            border: '1px solid #30363d',
            '&:hover': {
              borderColor: '#2ea043',
              cursor: 'pointer'
            }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DescriptionIcon sx={{ color: '#2ea043' }} />
              <Typography variant="subtitle1" sx={{ color: '#ffffff' }}>
                {project.title}
              </Typography>
            </Box>
            <Chip
              icon={<DataObjectIcon sx={{ color: '#2ea043' }} />}
              label={project.type}
              size="small"
              sx={{
                bgcolor: 'rgba(46, 160, 67, 0.1)',
                color: '#2ea043',
                border: '1px solid #2ea043'
              }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: '#8b949e' }}>
                Progress
              </Typography>
              <Typography variant="body2" sx={{ color: '#2ea043' }}>
                {project.progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={project.progress}
              sx={{
                bgcolor: '#21262d',
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#2ea043'
                },
                borderRadius: 1
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <GroupIcon sx={{ color: '#8b949e' }} />
              <Typography variant="body2" sx={{ color: '#8b949e' }}>
                Team Members
              </Typography>
            </Box>
            <AvatarGroup max={3}>
              {project.team.map((member, index) => (
                <Avatar
                  key={index}
                  sx={{ 
                    width: 24, 
                    height: 24,
                    fontSize: '0.75rem',
                    bgcolor: `hsl(${index * 60}, 70%, 30%)`
                  }}
                >
                  {member.initials}
                </Avatar>
              ))}
            </AvatarGroup>
          </Box>
        </Box>
      ))}
    </Box>
  );
} 