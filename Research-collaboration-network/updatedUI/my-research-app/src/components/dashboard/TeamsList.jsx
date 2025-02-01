'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { CircularProgress } from '@mui/material';
import { 
  Box, 
  Typography, 
  Avatar, 
  AvatarGroup, 
  Chip,
  Skeleton,
  Alert
} from '@mui/material';
import { Group as GroupIcon } from '@mui/icons-material';

// Dynamically import MUI components
const BoxDynamic = dynamic(() => import('@mui/material/Box'), { ssr: false });
const TypographyDynamic = dynamic(() => import('@mui/material/Typography'), { ssr: false });
const AvatarDynamic = dynamic(() => import('@mui/material/Avatar'), { ssr: false });
const AvatarGroupDynamic = dynamic(() => import('@mui/material/AvatarGroup'), { ssr: false });
const ChipDynamic = dynamic(() => import('@mui/material/Chip'), { ssr: false });
const AlertDynamic = dynamic(() => import('@mui/material/Alert'), { ssr: false });
const SkeletonDynamic = dynamic(() => import('@mui/material/Skeleton'), { ssr: false });
const GroupIconDynamic = dynamic(() => import('@mui/icons-material/Group'), { ssr: false });

function LoadingSpinner() {
  return (
    <BoxDynamic sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
      <CircularProgress />
    </BoxDynamic>
  );
}

export default function TeamsList() {
  const router = useRouter();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      // Use relative URL to leverage Next.js proxy
      const response = await fetch('/api/teams', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTeams(Array.isArray(data) ? data : []);
      setError(null);
    } catch (error) {
      console.error('Error fetching teams:', error);
      setError('Failed to load teams. Please check if the backend server is running.');
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return <LoadingSpinner />;
  }

  if (loading) {
    return (
      <BoxDynamic sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {[1, 2, 3].map((index) => (
          <BoxDynamic
            key={index}
            sx={{
              bgcolor: '#0d1117',
              borderRadius: 1,
              p: 2,
              border: '1px solid #30363d'
            }}
          >
            <BoxDynamic sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <SkeletonDynamic variant="text" width={150} sx={{ bgcolor: '#30363d' }} />
              <SkeletonDynamic variant="rectangular" width={80} height={24} sx={{ bgcolor: '#30363d', borderRadius: 1 }} />
            </BoxDynamic>
            <BoxDynamic sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <SkeletonDynamic variant="text" width={100} sx={{ bgcolor: '#30363d' }} />
              <SkeletonDynamic variant="circular" width={24} height={24} sx={{ bgcolor: '#30363d' }} />
            </BoxDynamic>
          </BoxDynamic>
        ))}
      </BoxDynamic>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ 
          bgcolor: 'rgba(248, 81, 73, 0.1)',
          color: '#ff6b6b',
          border: '1px solid rgba(248, 81, 73, 0.2)',
          '& .MuiAlert-icon': {
            color: '#ff6b6b'
          }
        }}
      >
        {error}
      </Alert>
    );
  }

  if (teams.length === 0) {
    return (
      <BoxDynamic
        sx={{
          bgcolor: '#161b22',
          borderRadius: 2,
          p: 4,
          border: '1px solid #30363d',
          textAlign: 'center'
        }}
      >
        <GroupIconDynamic sx={{ fontSize: 48, color: '#8b949e', mb: 2 }} />
        <TypographyDynamic variant="h6" sx={{ color: '#c9d1d9', mb: 1 }}>
          No Teams Found
        </TypographyDynamic>
        <TypographyDynamic variant="body2" sx={{ color: '#8b949e' }}>
          Create a new team to get started with collaboration
        </TypographyDynamic>
      </BoxDynamic>
    );
  }

  return (
    <BoxDynamic sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {teams.map((team, teamIndex) => (
        <BoxDynamic
          key={team.id || teamIndex}
          onClick={() => router.push(`/teams/${team.id}`)}
          sx={{
            bgcolor: '#0d1117',
            borderRadius: 1,
            p: 2,
            border: '1px solid #30363d',
            '&:hover': {
              borderColor: '#2ea043',
              cursor: 'pointer',
              transform: 'translateY(-1px)',
              transition: 'all 0.2s'
            }
          }}
        >
          <BoxDynamic sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <BoxDynamic sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <GroupIconDynamic sx={{ color: '#2ea043' }} />
              <TypographyDynamic variant="subtitle1" sx={{ color: '#ffffff' }}>
                {team.name}
              </TypographyDynamic>
            </BoxDynamic>
            <ChipDynamic
              label={`${team.activeProjects || 0} Projects`}
              size="small"
              sx={{
                bgcolor: 'rgba(46, 160, 67, 0.1)',
                color: '#2ea043',
                border: '1px solid #2ea043'
              }}
            />
          </BoxDynamic>

          {team.description && (
            <TypographyDynamic 
              variant="body2" 
              sx={{ 
                color: '#8b949e',
                mb: 2,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {team.description}
            </TypographyDynamic>
          )}

          <BoxDynamic sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <TypographyDynamic variant="body2" sx={{ color: '#8b949e' }}>
              {team.members?.length || 0} Members
            </TypographyDynamic>
            <AvatarGroupDynamic max={4}>
              {(team.members || []).map((member, index) => (
                <AvatarDynamic
                  key={member.id || index}
                  sx={{ 
                    width: 24, 
                    height: 24,
                    fontSize: '0.75rem',
                    bgcolor: `hsl(${(teamIndex * 90 + index * 60) % 360}, 70%, 30%)`
                  }}
                >
                  {member.initials || member.name?.split(' ').map(n => n[0]).join('')}
                </AvatarDynamic>
              ))}
            </AvatarGroupDynamic>
          </BoxDynamic>
        </BoxDynamic>
      ))}
    </BoxDynamic>
  );
}