'use client';

import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import StatsCard from './StatsCard';
import ProjectCard from './ProjectCard';
import ActivityFeed from './ActivityFeed';
import TeamsList from './TeamsList';

export default function DashboardContent() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeTeams: 0,
    upcomingEvents: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated data loading
    setTimeout(() => {
      setStats({
        totalProjects: 12,
        activeTeams: 8,
        upcomingEvents: 5
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: '#0d1117'
      }}>
        <Typography sx={{ color: '#8b949e' }}>Loading...</Typography>
      </Box>
    );
  }

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
        Dashboard Overview
      </Typography>

      {/* Stats Cards Row */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
        <StatsCard
          title="Active Projects"
          value={stats.totalProjects}
          trend="+35%"
          trendUp={true}
        />
        <StatsCard
          title="Team Members"
          value={stats.activeTeams}
          trend="+12%"
          trendUp={true}
        />
        <StatsCard
          title="Upcoming Events"
          value={stats.upcomingEvents}
          trend="-5%"
          trendUp={false}
        />
      </Box>

      {/* Main Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 3 }}>
        {/* Left Column */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{
            bgcolor: '#161b22',
            borderRadius: 2,
            p: 3,
            border: '1px solid #30363d'
          }}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2
            }}>
              <Typography variant="h6" sx={{ color: '#ffffff' }}>
                Recent Projects
              </Typography>
            </Box>
            <ProjectCard />
          </Box>

          <Box sx={{
            bgcolor: '#161b22',
            borderRadius: 2,
            p: 3,
            border: '1px solid #30363d'
          }}>
            <Typography variant="h6" sx={{ color: '#ffffff', mb: 2 }}>
              Activity Feed
            </Typography>
            <ActivityFeed />
          </Box>
        </Box>

        {/* Right Column */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{
            bgcolor: '#161b22',
            borderRadius: 2,
            p: 3,
            border: '1px solid #30363d'
          }}>
            <Typography variant="h6" sx={{ color: '#ffffff', mb: 2 }}>
              Your Teams
            </Typography>
            <TeamsList />
          </Box>
        </Box>
      </Box>
    </Box>
  );
} 