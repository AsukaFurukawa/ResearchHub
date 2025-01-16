import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Alert,
  Chip,
  Tooltip,
  Menu,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  PersonAdd as PersonAddIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Email as EmailIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Group as GroupIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openInviteDialog, setOpenInviteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [newTeamData, setNewTeamData] = useState({
    name: '',
    description: '',
  });
  const [inviteEmail, setInviteEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/teams', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTeams(data);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
      setError('Failed to fetch teams');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newTeamData),
      });

      if (response.ok) {
        setSuccess('Team created successfully!');
        setOpenCreateDialog(false);
        setNewTeamData({ name: '', description: '' });
        fetchTeams();
      } else {
        const error = await response.json();
        setError(error.message || 'Failed to create team');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditTeam = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/teams/${selectedTeam.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newTeamData),
      });

      if (response.ok) {
        setSuccess('Team updated successfully!');
        setOpenEditDialog(false);
        setNewTeamData({ name: '', description: '' });
        fetchTeams();
      } else {
        const error = await response.json();
        setError(error.message || 'Failed to update team');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/teams/${teamId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setSuccess('Team deleted successfully!');
          fetchTeams();
        } else {
          const error = await response.json();
          setError(error.message || 'Failed to delete team');
        }
      } catch (error) {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInviteMember = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/teams/${selectedTeam.id}/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email: inviteEmail }),
      });

      if (response.ok) {
        setSuccess('Invitation sent successfully!');
        setOpenInviteDialog(false);
        setInviteEmail('');
        fetchTeams();
      } else {
        const error = await response.json();
        setError(error.message || 'Failed to send invitation');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (teamId, memberId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/teams/${teamId}/members/${memberId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSuccess('Member removed successfully!');
        fetchTeams();
      } else {
        const error = await response.json();
        setError(error.message || 'Failed to remove member');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#0d1117',
        padding: 3,
      }}
    >
      <Box sx={{ maxWidth: 1200, margin: '0 auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              color: '#3fb950',
              fontWeight: 600,
              textShadow: '0 0 10px rgba(63, 185, 80, 0.3)',
            }}
          >
            Research Teams
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              size="small"
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: '#8b949e', mr: 1 }} />,
                sx: {
                  backgroundColor: '#161b22',
                  '& .MuiOutlinedInput-input': { color: '#c9d1d9' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#30363d' },
                }
              }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenCreateDialog(true)}
              sx={{
                bgcolor: '#3fb950',
                '&:hover': { bgcolor: '#2ea043' },
              }}
            >
              Create Team
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              backgroundColor: 'rgba(220, 38, 38, 0.1)',
              color: '#ff6b6b',
            }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{
              mb: 2,
              backgroundColor: 'rgba(63, 185, 80, 0.1)',
              color: '#3fb950',
            }}
            onClose={() => setSuccess('')}
          >
            {success}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress sx={{ color: '#3fb950' }} />
          </Box>
        ) : (
          <List>
            {filteredTeams.map((team) => (
              <Paper
                key={team.id}
                sx={{
                  mb: 2,
                  backgroundColor: '#161b22',
                  border: '1px solid #30363d',
                  borderRadius: 2,
                }}
              >
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <GroupIcon sx={{ color: '#3fb950' }} />
                        <Typography variant="h6" sx={{ color: '#c9d1d9' }}>
                          {team.name}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" sx={{ color: '#8b949e' }}>
                        {team.description}
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title="Invite Member">
                      <IconButton
                        onClick={() => {
                          setSelectedTeam(team);
                          setOpenInviteDialog(true);
                        }}
                        sx={{ color: '#3fb950' }}
                      >
                        <PersonAddIcon />
                      </IconButton>
                    </Tooltip>
                    <IconButton
                      onClick={(event) => {
                        setSelectedTeam(team);
                        setAnchorEl(event.currentTarget);
                      }}
                      sx={{ color: '#8b949e' }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Box sx={{ p: 2, borderTop: '1px solid #30363d' }}>
                  <Typography variant="subtitle2" sx={{ color: '#8b949e', mb: 1 }}>
                    Members:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {team.members?.map((member) => (
                      <Chip
                        key={member.id}
                        label={member.email}
                        onDelete={() => handleRemoveMember(team.id, member.id)}
                        sx={{
                          backgroundColor: '#1f242c',
                          color: '#c9d1d9',
                          borderColor: '#30363d',
                          '& .MuiChip-deleteIcon': {
                            color: '#ff6b6b',
                            '&:hover': { color: '#ff4444' },
                          },
                        }}
                      />
                    ))}
                    {team.pendingInvites?.map((invite) => (
                      <Chip
                        key={invite.id}
                        label={invite.email}
                        icon={<EmailIcon />}
                        variant="outlined"
                        sx={{
                          borderColor: '#3fb950',
                          color: '#3fb950',
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Paper>
            ))}
          </List>
        )}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          PaperProps={{
            sx: {
              backgroundColor: '#161b22',
              border: '1px solid #30363d',
              '& .MuiMenuItem-root': {
                color: '#c9d1d9',
                '&:hover': {
                  backgroundColor: '#1f242c',
                },
              },
            },
          }}
        >
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              setNewTeamData({
                name: selectedTeam.name,
                description: selectedTeam.description,
              });
              setOpenEditDialog(true);
            }}
          >
            <EditIcon sx={{ mr: 1, color: '#3fb950' }} />
            Edit Team
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              handleDeleteTeam(selectedTeam.id);
            }}
            sx={{ color: '#ff6b6b' }}
          >
            <DeleteIcon sx={{ mr: 1 }} />
            Delete Team
          </MenuItem>
        </Menu>

        {/* Create/Edit Team Dialog */}
        <Dialog
          open={openCreateDialog || openEditDialog}
          onClose={() => {
            setOpenCreateDialog(false);
            setOpenEditDialog(false);
            setNewTeamData({ name: '', description: '' });
          }}
          PaperProps={{
            sx: {
              backgroundColor: '#161b22',
              border: '1px solid #30363d',
            },
          }}
        >
          <DialogTitle sx={{ color: '#c9d1d9' }}>
            {openCreateDialog ? 'Create New Team' : 'Edit Team'}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Team Name"
              fullWidth
              value={newTeamData.name}
              onChange={(e) => setNewTeamData({ ...newTeamData, name: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#0d1117',
                  '& fieldset': { borderColor: '#30363d' },
                  '&:hover fieldset': { borderColor: '#3fb950' },
                },
                '& .MuiInputLabel-root': { color: '#8b949e' },
                '& .MuiOutlinedInput-input': { color: '#c9d1d9' },
              }}
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={newTeamData.description}
              onChange={(e) => setNewTeamData({ ...newTeamData, description: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#0d1117',
                  '& fieldset': { borderColor: '#30363d' },
                  '&:hover fieldset': { borderColor: '#3fb950' },
                },
                '& .MuiInputLabel-root': { color: '#8b949e' },
                '& .MuiOutlinedInput-input': { color: '#c9d1d9' },
              }}
            />
          </DialogContent>
          <DialogActions sx={{ padding: 2 }}>
            <Button
              onClick={() => {
                setOpenCreateDialog(false);
                setOpenEditDialog(false);
                setNewTeamData({ name: '', description: '' });
              }}
              sx={{ color: '#8b949e' }}
            >
              Cancel
            </Button>
            <Button
              onClick={openCreateDialog ? handleCreateTeam : handleEditTeam}
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: '#3fb950',
                '&:hover': { bgcolor: '#2ea043' },
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: '#fff' }} />
              ) : openCreateDialog ? (
                'Create'
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Invite Member Dialog */}
        <Dialog
          open={openInviteDialog}
          onClose={() => setOpenInviteDialog(false)}
          PaperProps={{
            sx: {
              backgroundColor: '#161b22',
              border: '1px solid #30363d',
            },
          }}
        >
          <DialogTitle sx={{ color: '#c9d1d9' }}>Invite Team Member</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Email Address"
              type="email"
              fullWidth
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#0d1117',
                  '& fieldset': { borderColor: '#30363d' },
                  '&:hover fieldset': { borderColor: '#3fb950' },
                },
                '& .MuiInputLabel-root': { color: '#8b949e' },
                '& .MuiOutlinedInput-input': { color: '#c9d1d9' },
              }}
            />
          </DialogContent>
          <DialogActions sx={{ padding: 2 }}>
            <Button
              onClick={() => setOpenInviteDialog(false)}
              sx={{ color: '#8b949e' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleInviteMember}
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: '#3fb950',
                '&:hover': { bgcolor: '#2ea043' },
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: '#fff' }} />
              ) : (
                'Send Invitation'
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
