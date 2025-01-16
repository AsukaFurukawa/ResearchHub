import { Box, Typography, Avatar, Divider } from '@mui/material';
import {
  Description as PaperIcon,
  People as TeamIcon,
  Comment as CommentIcon,
  Dataset as DatasetIcon
} from '@mui/icons-material';

export default function ActivityFeed() {
  // Mock data - replace with actual data from API
  const activities = [
    {
      id: 1,
      type: 'paper',
      user: {
        name: 'Dr. Sarah Chen',
        avatar: '/avatars/sarah.jpg'
      },
      action: 'updated the research paper',
      project: 'AI-Driven Cancer Research',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'team',
      user: {
        name: 'Prof. Michael Brown',
        avatar: '/avatars/michael.jpg'
      },
      action: 'added new team members to',
      project: 'Quantum Computing Algorithms',
      time: '4 hours ago'
    },
    {
      id: 3,
      type: 'comment',
      user: {
        name: 'Dr. Emily White',
        avatar: '/avatars/emily.jpg'
      },
      action: 'commented on',
      project: 'Climate Change Analysis',
      time: '6 hours ago'
    },
    {
      id: 4,
      type: 'dataset',
      user: {
        name: 'Dr. James Wilson',
        avatar: '/avatars/james.jpg'
      },
      action: 'shared a new dataset in',
      project: 'Neural Network Research',
      time: '8 hours ago'
    }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'paper':
        return <PaperIcon sx={{ color: '#3fb950' }} />;
      case 'team':
        return <TeamIcon sx={{ color: '#f0883e' }} />;
      case 'comment':
        return <CommentIcon sx={{ color: '#58a6ff' }} />;
      case 'dataset':
        return <DatasetIcon sx={{ color: '#7ee787' }} />;
      default:
        return null;
    }
  };

  return (
    <Box>
      {activities.map((activity, index) => (
        <Box key={activity.id}>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              py: 2,
              px: 1,
              '&:hover': {
                bgcolor: 'rgba(63, 185, 80, 0.05)',
                borderRadius: 1
              }
            }}
          >
            <Avatar
              src={activity.user.avatar}
              alt={activity.user.name}
              sx={{ width: 40, height: 40 }}
            />
            
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                {getActivityIcon(activity.type)}
                <Typography
                  variant="body2"
                  sx={{ color: '#ffffff' }}
                >
                  <span style={{ fontWeight: 600 }}>{activity.user.name}</span>
                  {' '}{activity.action}{' '}
                  <span style={{ color: '#3fb950' }}>{activity.project}</span>
                </Typography>
              </Box>
              
              <Typography
                variant="caption"
                sx={{ color: '#8b949e' }}
              >
                {activity.time}
              </Typography>
            </Box>
          </Box>
          
          {index < activities.length - 1 && (
            <Divider
              sx={{
                borderColor: '#30363d'
              }}
            />
          )}
        </Box>
      ))}
    </Box>
  );
} 