import { Box, Typography, LinearProgress, Chip, Avatar, AvatarGroup } from '@mui/material';
import { useRouter } from 'next/router';
import {
  Description as DescriptionIcon,
  Group as GroupIcon,
  DataObject as DataObjectIcon
} from '@mui/icons-material';

export default function ProjectCard({ project }) {
  const router = useRouter();

  // Return null if project is undefined or null
  if (!project) {
    return null;
  }

  const handleClick = () => {
    router.push(`/projects/${project.id}`);
  };

  // Destructure project with default values to prevent undefined errors
  const {
    title = 'Untitled Project',
    description = '',
    visibility = 'private',
    progress = 0,
    papers = [],
    team = null,
    datasets = [],
    creator = null
  } = project;

  return (
    <Box
      onClick={handleClick}
      sx={{
        bgcolor: '#161b22',
        border: '1px solid #30363d',
        borderRadius: 2,
        p: 2.5,
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          borderColor: '#3fb950'
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>
          {title}
        </Typography>
        <Chip
          label={visibility === 'public' ? 'Public' : 'Private'}
          size="small"
          sx={{
            bgcolor: visibility === 'public' ? 'rgba(63, 185, 80, 0.1)' : 'rgba(248, 81, 73, 0.1)',
            color: visibility === 'public' ? '#3fb950' : '#f85149',
            borderRadius: 1
          }}
        />
      </Box>

      <Typography variant="body2" sx={{ color: '#8b949e', mb: 2 }}>
        {description}
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="body2" sx={{ color: '#8b949e' }}>
            Progress
          </Typography>
          <Typography variant="body2" sx={{ color: '#ffffff' }}>
            {progress}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            bgcolor: '#21262d',
            '& .MuiLinearProgress-bar': {
              bgcolor: '#3fb950'
            },
            borderRadius: 1,
            height: 6
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 2, color: '#8b949e' }}>
        {papers.length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <DescriptionIcon sx={{ fontSize: 16 }} />
            <Typography variant="body2">{papers.length} Papers</Typography>
          </Box>
        )}
        
        {team && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <GroupIcon sx={{ fontSize: 16 }} />
            <Typography variant="body2">{team.name}</Typography>
          </Box>
        )}

        {datasets.length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <DataObjectIcon sx={{ fontSize: 16 }} />
            <Typography variant="body2">{datasets.length} Datasets</Typography>
          </Box>
        )}
      </Box>

      {creator && (
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.75rem' } }}>
            <Avatar
              alt={creator.name}
              src={creator.avatar}
              sx={{ border: '2px solid #161b22' }}
            />
            {/* Add more team member avatars here when available */}
          </AvatarGroup>
          <Typography variant="body2" sx={{ color: '#8b949e' }}>
            {creator.name}
          </Typography>
        </Box>
      )}
    </Box>
  );
} 