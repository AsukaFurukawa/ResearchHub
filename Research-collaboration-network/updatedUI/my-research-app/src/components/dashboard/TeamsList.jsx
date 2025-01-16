import { Box, Typography, Avatar, AvatarGroup, Chip, LinearProgress } from '@mui/material';
import { Lock as PrivateIcon, Public as PublicIcon } from '@mui/icons-material';

export default function TeamsList() {
  // Mock data - replace with actual data from API
  const teams = [
    {
      id: 1,
      name: 'Quantum Research Group',
      members: [
        { name: 'Alice Johnson', avatar: '/avatars/alice.jpg' },
        { name: 'Bob Smith', avatar: '/avatars/bob.jpg' },
        { name: 'Carol White', avatar: '/avatars/carol.jpg' },
        { name: 'David Brown', avatar: '/avatars/david.jpg' },
        { name: 'Eve Wilson', avatar: '/avatars/eve.jpg' }
      ],
      activeProjects: 3,
      isPrivate: true,
      progress: 75
    },
    {
      id: 2,
      name: 'ML Research Team',
      members: [
        { name: 'Frank Miller', avatar: '/avatars/frank.jpg' },
        { name: 'Grace Lee', avatar: '/avatars/grace.jpg' },
        { name: 'Henry Davis', avatar: '/avatars/henry.jpg' }
      ],
      activeProjects: 2,
      isPrivate: false,
      progress: 45
    },
    {
      id: 3,
      name: 'Genomics Lab',
      members: [
        { name: 'Ivy Chen', avatar: '/avatars/ivy.jpg' },
        { name: 'Jack Wang', avatar: '/avatars/jack.jpg' },
        { name: 'Kelly Zhang', avatar: '/avatars/kelly.jpg' },
        { name: 'Liam Brown', avatar: '/avatars/liam.jpg' }
      ],
      activeProjects: 4,
      isPrivate: true,
      progress: 60
    }
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {teams.map((team) => (
        <Box
          key={team.id}
          sx={{
            bgcolor: '#0d1117',
            borderRadius: 2,
            p: 2,
            border: '1px solid #30363d',
            '&:hover': {
              borderColor: '#3fb950',
              boxShadow: '0 0 10px rgba(63, 185, 80, 0.1)',
              cursor: 'pointer'
            }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 600 }}>
                {team.name}
              </Typography>
              {team.isPrivate ? (
                <PrivateIcon sx={{ color: '#8b949e', fontSize: 16 }} />
              ) : (
                <PublicIcon sx={{ color: '#3fb950', fontSize: 16 }} />
              )}
            </Box>
            <Chip
              label={`${team.activeProjects} projects`}
              size="small"
              sx={{
                bgcolor: 'rgba(63, 185, 80, 0.1)',
                color: '#3fb950',
                height: 24,
                borderRadius: 1
              }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: '#8b949e' }}>
                Overall Progress
              </Typography>
              <Typography variant="body2" sx={{ color: '#3fb950' }}>
                {team.progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={team.progress}
              sx={{
                bgcolor: 'rgba(63, 185, 80, 0.1)',
                borderRadius: 1,
                height: 4,
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#3fb950'
                }
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <AvatarGroup
              max={4}
              sx={{
                '& .MuiAvatar-root': {
                  width: 28,
                  height: 28,
                  fontSize: '0.875rem',
                  border: '2px solid #0d1117'
                }
              }}
            >
              {team.members.map((member, index) => (
                <Avatar
                  key={index}
                  src={member.avatar}
                  alt={member.name}
                />
              ))}
            </AvatarGroup>
            
            <Typography
              variant="caption"
              sx={{
                color: '#8b949e',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}
            >
              {team.members.length} members
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
} 