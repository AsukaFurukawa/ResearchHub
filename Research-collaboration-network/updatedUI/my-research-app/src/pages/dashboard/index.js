import { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Badge } from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import Sidebar from '../../components/navigation/Sidebar';
import ProjectCard from '../../components/dashboard/ProjectCard';
import StatsCard from '../../components/dashboard/StatsCard';
import ActivityFeed from '../../components/dashboard/ActivityFeed';
import TeamsList from '../../components/dashboard/TeamsList';
import ProfileDropdown from '../../components/ProfileDropdown';

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeTeams: 0,
    upcomingEvents: 0
  });

  useEffect(() => {
    // Fetch user data and stats from API
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setStats(data.stats);
        setUserData(data.user);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Box sx={{ display: 'flex', bgcolor: '#0d1117', minHeight: '100vh' }}>
      <Sidebar />
      
      <Box sx={{ flexGrow: 1 }}>
        {/* Top Navigation Bar */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: '1px solid #30363d'
        }}>
          <Typography variant="h5" sx={{ color: '#3fb950', fontWeight: 600 }}>
            Dashboard
          </Typography>

          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: '#161b22',
            borderRadius: 2,
            p: 1,
            mx: 2,
            flex: 1,
            maxWidth: 600
          }}>
            <SearchIcon sx={{ color: '#8b949e', mr: 1 }} />
            <input
              placeholder="Search projects, teams, or events..."
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                width: '100%',
                outline: 'none'
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ color: '#8b949e' }}>
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <ProfileDropdown user={userData} />
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ p: 3 }}>
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
      </Box>
    </Box>
  );
}


