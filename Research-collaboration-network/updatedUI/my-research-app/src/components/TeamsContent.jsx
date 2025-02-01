'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
  Alert,
  LinearProgress,
  Avatar,
  AvatarGroup
} from '@mui/material';
import { 
  Add as AddIcon, 
  Search as SearchIcon, 
  Close as CloseIcon, 
  PersonAdd as PersonAddIcon,
  Lock as LockIcon,
  Public as PublicIcon,
  MoreVert as MoreVertIcon,
  Chat as ChatIcon,
  Description as DescriptionIcon,
  CalendarToday as CalendarIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

export default function TeamsContent() {
  const { user, loading: authLoading } = useAuth();
  const userEmail = user?.email || '';

  const [teams, setTeams] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: '',
    description: '',
    members: [],
    isPrivate: false
  });
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [createError, setCreateError] = useState('');
  const [hasEmailError, setHasEmailError] = useState(false);

  const getAvatarColor = (identifier) => {
    const colors = [
      '#238636', // green
      '#1f6feb', // blue
      '#a371f7', // purple
      '#f85149', // red
      '#db61a2', // pink
      '#f0883e', // orange
    ];
    
    // Generate a consistent index based on the identifier string
    const index = Array.from(identifier).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No authentication token found');
        setError('Authentication required');
        setLoading(false);
        return;
      }

      console.log('Fetching teams with token:', token);
      const response = await fetch('http://localhost:5000/api/teams', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Teams data received:', data);
        
        // If no teams exist, use dummy data
        if (!data || data.length === 0) {
          console.log('No teams found, using dummy data');
          setTeams(dummyTeams);
        } else {
          const transformedTeams = data.map(team => ({
            ...team,
            members: team.members.map(member => ({
              email: member.email,
              name: member.name,
              avatar: member.avatar,
              role: member.role
            })),
            projects: team.projects || [],
            publications: team.publications || [],
            meetings: team.meetings || [],
            progress: calculateTeamProgress(team)
          }));
          setTeams(transformedTeams);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        setError(errorData.message || 'Failed to load teams');
        // If API fails, use dummy data
        setTeams(dummyTeams);
      }
    } catch (error) {
      console.error('Error loading teams:', error);
      setError('Error loading teams');
      // If API fails, use dummy data
      setTeams(dummyTeams);
    } finally {
      setLoading(false);
    }
  };

  const calculateTeamProgress = (team) => {
    if (!team.projects || team.projects.length === 0) return 0;
    const completedProjects = team.projects.filter(p => p.status === 'completed').length;
    return Math.round((completedProjects / team.projects.length) * 100);
  };

  useEffect(() => {
    if (!authLoading) {
      console.log('Auth state loaded:', { user });
      fetchTeams();
    }
  }, [authLoading, user]);

  const searchUsers = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      setSearching(true);
      
      const response = await fetch(`http://localhost:5000/api/teams/users/search?q=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const users = await response.json();
        setSearchResults(users);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleEmailSearch = (email) => {
    if (email.trim()) {
      searchUsers(email);
    }
  };

  // Debounce the search to avoid too many requests
  useEffect(() => {
    const timer = setTimeout(() => {
      if (newMemberEmail) {
        handleEmailSearch(newMemberEmail);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [newMemberEmail]);

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  useEffect(() => {
    if (newMemberEmail) {
      setHasEmailError(!isValidEmail(newMemberEmail));
    } else {
      setHasEmailError(false);
    }
  }, [newMemberEmail]);

  const handleAddMember = async (user) => {
    if (!user) return;

    // Check if member is already added
    if (newTeam.members.some(m => m.email === user.email)) {
      setCreateError("This member is already added to the team");
      return;
    }

    // Check if trying to add self
    if (user.email === userEmail) {
      setCreateError("You can't add yourself as a member");
      return;
    }

    setNewTeam(prev => ({
      ...prev,
      members: [...prev.members, user]
    }));
    setNewMemberEmail('');
    setSearchResults([]);
    setCreateError('');
  };

  const handleRemoveMember = (userId) => {
    setNewTeam(prev => ({
      ...prev,
      members: prev.members.filter(member => member.id !== userId)
    }));
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewTeam({ name: '', description: '', members: [], isPrivate: false });
    setNewMemberEmail('');
    setCreateError('');
  };

  const handleCreateTeam = async () => {
    if (!newTeam.name.trim()) {
      setCreateError('Team name is required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setCreateError('Authentication required');
        return;
      }

      const response = await fetch('http://localhost:5000/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newTeam.name,
          description: newTeam.description,
          memberIds: newTeam.members.map(member => member.id)
        })
      });

      if (response.ok) {
        const createdTeam = await response.json();
        setTeams(prevTeams => [...prevTeams, {
          ...createdTeam,
          progress: 0,
          projects: [],
          publications: [],
          meetings: []
        }]);
        handleCloseDialog();
      } else {
        const errorData = await response.json();
        setCreateError(errorData.message || 'Failed to create team');
      }
    } catch (error) {
      console.error('Error creating team:', error);
      setCreateError('Failed to create team. Please try again.');
    }
  };

  // Reduce dummy data to 3 teams maximum
  const dummyTeams = [
    {
      id: 1,
      name: "Research Team Alpha",
      description: "Investigating machine learning applications in healthcare",
      isPrivate: false,
      progress: 65,
      members: [
        { id: 1, name: "John Doe", email: "john@example.com", role: "Leader" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Researcher" }
      ],
      projects: [{ id: 1, status: 'completed' }, { id: 2, status: 'in_progress' }],
      publications: [{ id: 1 }],
      meetings: [{ id: 1 }, { id: 2 }]
    },
    {
      id: 2,
      name: "Data Science Group",
      description: "Working on big data analytics and visualization",
      isPrivate: true,
      progress: 40,
      members: [
        { id: 3, name: "Alice Johnson", email: "alice@example.com", role: "Leader" },
        { id: 4, name: "Bob Wilson", email: "bob@example.com", role: "Analyst" }
      ],
      projects: [{ id: 3, status: 'in_progress' }],
      publications: [],
      meetings: [{ id: 3 }]
    },
    {
      id: 3,
      name: "AI Ethics Committee",
      description: "Studying ethical implications of AI development",
      isPrivate: false,
      progress: 80,
      members: [
        { id: 5, name: "Carol Brown", email: "carol@example.com", role: "Leader" },
        { id: 6, name: "David Lee", email: "david@example.com", role: "Researcher" }
      ],
      projects: [{ id: 4, status: 'completed' }, { id: 5, status: 'completed' }],
      publications: [{ id: 2 }, { id: 3 }],
      meetings: [{ id: 4 }, { id: 5 }, { id: 6 }]
    }
  ];

  // Use dummy data only if no real teams are loaded
  const displayTeams = teams.length > 0 ? teams : dummyTeams;

  const filteredTeams = displayTeams.filter(team => 
    team.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading || authLoading) {
    return (
      <Box 
        sx={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          minHeight: "calc(100vh - 64px)",
          bgcolor: '#0d1117',
          marginLeft: '240px'
        }}
      >
        <CircularProgress sx={{ color: '#238636' }} />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box 
        sx={{ 
          textAlign: "center", 
          mt: 4,
          bgcolor: '#0d1117',
          color: '#8b949e',
          minHeight: "calc(100vh - 64px)",
          marginLeft: '240px'
        }}
      >
        <Typography>
          Please log in to view teams
        </Typography>
      </Box>
    );
  }

  return (
    <Box 
      component="main"
      sx={{ 
        flexGrow: 1,
        bgcolor: '#0d1117',
        minHeight: "100vh",
        paddingLeft: '240px',
        paddingTop: '64px',
        paddingBottom: 6,
        boxSizing: 'border-box',
        position: 'relative',
        width: '100%'
      }}
    >
      <Box 
        sx={{ 
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          position: 'relative',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <Box 
          sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            mb: 4,
            mt: 2
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: "bold", 
              color: '#c9d1d9',
              fontSize: '2rem'
            }}
          >
            Research Teams
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              size="small"
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                minWidth: '240px',
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#010409',
                  '& fieldset': {
                    borderColor: '#30363d',
                  },
                  '&:hover fieldset': {
                    borderColor: '#58a6ff',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#58a6ff',
                  },
                },
                '& .MuiInputBase-input': {
                  color: '#c9d1d9',
                  '&::placeholder': {
                    color: '#8b949e',
                    opacity: 1,
                  },
                },
              }}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: '#8b949e' }} />,
              }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
              sx={{
                bgcolor: '#238636',
                '&:hover': {
                  bgcolor: '#2ea043',
                },
                textTransform: 'none',
                fontWeight: 600,
                px: 2
              }}
            >
              Create Team
            </Button>
          </Box>
        </Box>

        {error ? (
          <Alert 
            severity="error" 
            sx={{ 
              mt: 2,
              bgcolor: 'rgba(248,81,73,0.1)',
              color: '#f85149',
              border: '1px solid rgba(248,81,73,0.4)',
              '& .MuiAlert-icon': {
                color: '#f85149'
              }
            }}
          >
            {error}
          </Alert>
        ) : filteredTeams.length === 0 ? (
          <Box 
            sx={{ 
              textAlign: "center", 
              mt: 4,
              color: '#8b949e'
            }}
          >
            <Typography>
              No teams found. Create your first team!
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredTeams.map((team, index) => (
              <Grid item xs={12} sm={6} lg={4} key={index}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    bgcolor: '#161b22',
                    borderColor: '#30363d',
                    '&:hover': {
                      borderColor: '#58a6ff',
                    },
                    transition: 'border-color 0.2s ease-in-out'
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography 
                            variant="h6"
                            sx={{ color: '#c9d1d9' }}
                          >
                            {team.name || 'Untitled Team'}
                          </Typography>
                          {team.isPrivate ? (
                            <LockIcon sx={{ color: '#8b949e', fontSize: 16 }} />
                          ) : (
                            <PublicIcon sx={{ color: '#3fb950', fontSize: 16 }} />
                          )}
                        </Box>
                        <Typography 
                          variant="body2"
                          sx={{ 
                            color: '#8b949e',
                            mb: 2
                          }}
                        >
                          {team.description || 'No description'}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        sx={{ 
                          color: '#8b949e',
                          '&:hover': { color: '#c9d1d9', bgcolor: 'rgba(201,209,217,0.1)' }
                        }}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#8b949e' }}>
                          Overall Progress
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#3fb950' }}>
                          {team.progress || 0}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={team.progress || 0}
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

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ color: '#8b949e', mb: 1.5 }}>
                        Quick Stats
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <Box sx={{ 
                            p: 1, 
                            bgcolor: 'rgba(63, 185, 80, 0.1)', 
                            borderRadius: 1,
                            textAlign: 'center'
                          }}>
                            <Typography variant="body2" sx={{ color: '#3fb950', fontWeight: 600 }}>
                              {team.projects?.length || 0}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#8b949e' }}>
                              Projects
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={4}>
                          <Box sx={{ 
                            p: 1, 
                            bgcolor: 'rgba(88, 166, 255, 0.1)', 
                            borderRadius: 1,
                            textAlign: 'center'
                          }}>
                            <Typography variant="body2" sx={{ color: '#58a6ff', fontWeight: 600 }}>
                              {team.publications?.length || 0}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#8b949e' }}>
                              Publications
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={4}>
                          <Box sx={{ 
                            p: 1, 
                            bgcolor: 'rgba(246, 185, 59, 0.1)', 
                            borderRadius: 1,
                            textAlign: 'center'
                          }}>
                            <Typography variant="body2" sx={{ color: '#f6b93b', fontWeight: 600 }}>
                              {team.meetings?.length || 0}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#8b949e' }}>
                              Meetings
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ color: '#8b949e', mb: 1 }}>
                        Team Members
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <AvatarGroup max={4} sx={{ justifyContent: 'flex-start' }}>
                          {(team.members || []).map((member, idx) => {
                            const email = typeof member === 'string' ? member : member?.email;
                            const name = typeof member === 'string' ? member : member?.name;
                            const role = typeof member === 'string' ? 'Member' : member?.role;
                            
                            if (!email) return null;
                            
                            return (
                              <Avatar
                                key={idx}
                                title={`${name || email} (${role || 'Member'})`}
                                sx={{
                                  width: 28,
                                  height: 28,
                                  fontSize: '0.875rem',
                                  bgcolor: getAvatarColor(email),
                                  color: '#fff'
                                }}
                              >
                                {name ? name.charAt(0).toUpperCase() : email.charAt(0).toUpperCase()}
                              </Avatar>
                            );
                          })}
                        </AvatarGroup>
                        <Button
                          size="small"
                          startIcon={<PersonAddIcon />}
                          sx={{
                            color: '#8b949e',
                            '&:hover': {
                              bgcolor: 'rgba(201,209,217,0.1)',
                              color: '#c9d1d9'
                            }
                          }}
                        >
                          Invite
                        </Button>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        sx={{ 
                          color: '#8b949e',
                          '&:hover': { color: '#58a6ff', bgcolor: 'rgba(88,166,255,0.1)' }
                        }}
                      >
                        <ChatIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{ 
                          color: '#8b949e',
                          '&:hover': { color: '#3fb950', bgcolor: 'rgba(63,185,80,0.1)' }
                        }}
                      >
                        <DescriptionIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{ 
                          color: '#8b949e',
                          '&:hover': { color: '#f6b93b', bgcolor: 'rgba(246,185,59,0.1)' }
                        }}
                      >
                        <CalendarIcon fontSize="small" />
                      </IconButton>
                      <Button
                        variant="text"
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          ml: 'auto',
                          color: '#58a6ff',
                          '&:hover': {
                            bgcolor: 'rgba(88,166,255,0.1)'
                          }
                        }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: '#161b22',
              color: '#c9d1d9',
              backgroundImage: 'none'
            }
          }}
        >
          <DialogTitle>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6" sx={{ color: '#c9d1d9' }}>
                Create New Team
              </Typography>
              <IconButton 
                onClick={handleCloseDialog} 
                size="small"
                sx={{ color: '#8b949e', '&:hover': { color: '#c9d1d9' } }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            {createError && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 2,
                  bgcolor: 'rgba(248,81,73,0.1)',
                  color: '#f85149',
                  border: '1px solid rgba(248,81,73,0.4)',
                  '& .MuiAlert-icon': {
                    color: '#f85149'
                  }
                }}
              >
                {createError}
              </Alert>
            )}
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                label="Team Name"
                fullWidth
                value={newTeam.name}
                onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#0d1117',
                    '& fieldset': {
                      borderColor: '#30363d',
                    },
                    '&:hover fieldset': {
                      borderColor: '#58a6ff',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#58a6ff',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: '#c9d1d9',
                  },
                  '& .MuiInputLabel-root': {
                    color: '#8b949e',
                    '&.Mui-focused': {
                      color: '#58a6ff'
                    }
                  }
                }}
              />
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={newTeam.description}
                onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#0d1117',
                    '& fieldset': {
                      borderColor: '#30363d',
                    },
                    '&:hover fieldset': {
                      borderColor: '#58a6ff',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#58a6ff',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: '#c9d1d9',
                  },
                  '& .MuiInputLabel-root': {
                    color: '#8b949e',
                    '&.Mui-focused': {
                      color: '#58a6ff'
                    }
                  }
                }}
              />
              <Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <TextField
                    label="Add Member Email"
                    fullWidth
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    error={hasEmailError}
                    helperText={hasEmailError ? "Please enter a valid email" : ""}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: '#0d1117',
                        '& fieldset': {
                          borderColor: '#30363d',
                        },
                        '&:hover fieldset': {
                          borderColor: '#58a6ff',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#58a6ff',
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: '#c9d1d9',
                      },
                      '& .MuiInputLabel-root': {
                        color: '#8b949e',
                        '&.Mui-focused': {
                          color: '#58a6ff'
                        }
                      },
                      '& .MuiFormHelperText-root': {
                        color: '#f85149'
                      }
                    }}
                  />
                  <IconButton 
                    onClick={() => isValidEmail(newMemberEmail) && handleEmailSearch(newMemberEmail)}
                    disabled={!isValidEmail(newMemberEmail) || searching}
                    sx={{
                      bgcolor: '#238636',
                      color: 'white',
                      '&:hover': {
                        bgcolor: '#2ea043',
                      },
                      '&.Mui-disabled': {
                        bgcolor: '#21262d',
                        color: '#8b949e'
                      }
                    }}
                  >
                    {searching ? (
                      <CircularProgress size={24} sx={{ color: '#fff' }} />
                    ) : (
                      <PersonAddIcon />
                    )}
                  </IconButton>
                </Box>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <Box sx={{ mt: 2, maxHeight: 200, overflowY: 'auto' }}>
                    <Typography variant="subtitle2" sx={{ color: '#8b949e', mb: 1 }}>
                      Found Users:
                    </Typography>
                    <Stack spacing={1}>
                      {searchResults.map((user) => (
                        <Box
                          key={user.id}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: 1,
                            borderRadius: 1,
                            bgcolor: '#21262d',
                            '&:hover': {
                              bgcolor: '#30363d'
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar
                              src={user.avatar}
                              sx={{
                                width: 24,
                                height: 24,
                                bgcolor: '#30363d'
                              }}
                            >
                              {user.name.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ color: '#c9d1d9' }}>
                                {user.name}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#8b949e' }}>
                                {user.email}
                              </Typography>
                            </Box>
                          </Box>
                          <Button
                            size="small"
                            onClick={() => handleAddMember(user)}
                            sx={{
                              color: '#3fb950',
                              '&:hover': {
                                bgcolor: 'rgba(63,185,80,0.1)'
                              }
                            }}
                          >
                            Add
                          </Button>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}

                {/* Selected Members */}
                {newTeam.members.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography 
                      variant="subtitle2" 
                      gutterBottom
                      sx={{ color: '#c9d1d9' }}
                    >
                      Team Members:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {newTeam.members.map((member, index) => (
                        <Chip
                          key={index}
                          avatar={
                            <Avatar
                              src={member.avatar}
                              sx={{ bgcolor: '#30363d' }}
                            >
                              {member.name.charAt(0)}
                            </Avatar>
                          }
                          label={member.name}
                          onDelete={() => handleRemoveMember(member.id)}
                          size="small"
                          sx={{
                            bgcolor: '#21262d',
                            color: '#c9d1d9',
                            '& .MuiChip-deleteIcon': {
                              color: '#8b949e',
                              '&:hover': {
                                color: '#f85149'
                              }
                            }
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button 
              onClick={handleCloseDialog}
              sx={{ 
                color: '#c9d1d9',
                '&:hover': {
                  bgcolor: 'rgba(201,209,217,0.1)'
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleCreateTeam}
              sx={{
                bgcolor: '#238636',
                '&:hover': {
                  bgcolor: '#2ea043',
                },
                textTransform: 'none'
              }}
            >
              Create team
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
} 