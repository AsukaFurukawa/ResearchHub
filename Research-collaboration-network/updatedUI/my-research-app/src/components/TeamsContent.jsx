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
  Public as PublicIcon
} from '@mui/icons-material';

export default function TeamsContent() {
  const { user, loading: authLoading } = useAuth();
  const userEmail = user?.email || '';

  const [teams, setTeams] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newTeam, setNewTeam] = useState({
    name: '',
    description: '',
    members: [],
    isPrivate: false
  });
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [createError, setCreateError] = useState('');

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await fetch('http://localhost:5000/api/teams', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTeams(data);
      } else {
        setError('Failed to load teams');
      }
    } catch (error) {
      console.error('Error loading teams:', error);
      setError('Error loading teams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && userEmail) {
      fetchTeams();
    }
  }, [authLoading, userEmail]);

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
          ...newTeam,
          members: [...newTeam.members, userEmail]
        })
      });

      if (response.ok) {
        const createdTeam = await response.json();
        setTeams([...teams, createdTeam]);
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

  const handleAddMember = () => {
    if (newMemberEmail && !newTeam.members.includes(newMemberEmail)) {
      if (userEmail === newMemberEmail) {
        setCreateError("You can't add yourself as a member");
        return;
      }
      setNewTeam({
        ...newTeam,
        members: [...newTeam.members, newMemberEmail]
      });
      setNewMemberEmail('');
      setCreateError('');
    }
  };

  const handleRemoveMember = (email) => {
    setNewTeam({
      ...newTeam,
      members: newTeam.members.filter(member => member !== email)
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewTeam({ name: '', description: '', members: [], isPrivate: false });
    setNewMemberEmail('');
    setCreateError('');
  };

  const filteredTeams = teams.filter(team => 
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
          bgcolor: '#0d1117'
        }}
      >
        <CircularProgress sx={{ color: '#238636' }} />
      </Box>
    );
  }

  if (!userEmail) {
    return (
      <Box 
        sx={{ 
          textAlign: "center", 
          mt: 4,
          bgcolor: '#0d1117',
          color: '#8b949e',
          minHeight: "calc(100vh - 64px)"
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
      sx={{ 
        bgcolor: '#0d1117',
        minHeight: "calc(100vh - 64px)",
        width: '100%',
        pt: 4,
        pb: 6
      }}
    >
      <Box 
        sx={{ 
          maxWidth: '1280px',
          mx: 'auto',
          px: 3
        }}
      >
        <Box 
          sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            mb: 4
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
                      <Box>
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
                      <Chip
                        label={`${team.projects?.length || 0} projects`}
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

                    <Box>
                      <Typography variant="body2" sx={{ color: '#8b949e', mb: 1 }}>
                        Team Members
                      </Typography>
                      <AvatarGroup max={4} sx={{ justifyContent: 'flex-start' }}>
                        {(team.members || []).map((member, idx) => {
                          const email = typeof member === 'string' ? member : member?.email;
                          const name = typeof member === 'string' ? member : member?.name;
                          
                          if (!email) return null;
                          
                          return (
                            <Avatar
                              key={idx}
                              sx={{
                                width: 28,
                                height: 28,
                                fontSize: '0.875rem',
                                bgcolor: email === userEmail ? '#238636' : '#30363d',
                                color: '#fff'
                              }}
                            >
                              {name ? name.charAt(0).toUpperCase() : email.charAt(0).toUpperCase()}
                            </Avatar>
                          );
                        })}
                      </AvatarGroup>
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
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newMemberEmail) {
                        e.preventDefault();
                        handleAddMember();
                      }
                    }}
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
                  <IconButton 
                    onClick={handleAddMember}
                    sx={{
                      bgcolor: '#238636',
                      color: 'white',
                      '&:hover': {
                        bgcolor: '#2ea043',
                      }
                    }}
                  >
                    <PersonAddIcon />
                  </IconButton>
                </Box>
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
                      {newTeam.members.map((email, index) => (
                        <Chip
                          key={index}
                          label={email}
                          onDelete={() => handleRemoveMember(email)}
                          size="small"
                          sx={{
                            bgcolor: '#21262d',
                            color: '#8b949e',
                            '& .MuiChip-deleteIcon': {
                              color: '#8b949e',
                              '&:hover': {
                                color: '#c9d1d9'
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