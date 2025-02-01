'use client';

import { Box, Typography, Avatar } from '@mui/material';
import {
  Description as DescriptionIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Comment as CommentIcon
} from '@mui/icons-material';

const activities = [
  {
    id: 1,
    user: {
      name: 'John Doe',
      initials: 'JD'
    },
    action: 'added a new research paper',
    project: 'AI Research Paper',
    time: '2 hours ago',
    icon: <DescriptionIcon sx={{ color: '#2ea043' }} />
  },
  {
    id: 2,
    user: {
      name: 'Jane Smith',
      initials: 'JS'
    },
    action: 'updated the project status',
    project: 'Data Analysis Project',
    time: '4 hours ago',
    icon: <EditIcon sx={{ color: '#3fb950' }} />
  },
  {
    id: 3,
    user: {
      name: 'Mike Johnson',
      initials: 'MJ'
    },
    action: 'joined the team',
    project: 'Machine Learning Study',
    time: '6 hours ago',
    icon: <AddIcon sx={{ color: '#4ac959' }} />
  },
  {
    id: 4,
    user: {
      name: 'Sarah Wilson',
      initials: 'SW'
    },
    action: 'commented on',
    project: 'Statistical Analysis',
    time: '8 hours ago',
    icon: <CommentIcon sx={{ color: '#56d364' }} />
  }
];

export default function ActivityFeed() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {activities.map((activity, index) => (
        <Box
          key={activity.id}
          sx={{
            display: 'flex',
            gap: 2,
            p: 2,
            bgcolor: '#0d1117',
            borderRadius: 1,
            border: '1px solid #30363d',
            '&:hover': {
              borderColor: '#2ea043',
              cursor: 'pointer'
            }
          }}
        >
          <Avatar
            sx={{ 
              width: 32, 
              height: 32,
              fontSize: '0.875rem',
              bgcolor: `hsl(${index * 60}, 70%, 30%)`
            }}
          >
            {activity.user.initials}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 500 }}>
                {activity.user.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#8b949e' }}>
                {activity.action}
              </Typography>
              <Typography variant="body2" sx={{ color: '#2ea043', fontWeight: 500 }}>
                {activity.project}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {activity.icon}
              <Typography variant="caption" sx={{ color: '#8b949e' }}>
                {activity.time}
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
} 