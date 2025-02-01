import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  Grid
} from '@mui/material';

export default function RegisterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    institution: '',
    department: '',
    researchInterests: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#0d1117',
        py: 4
      }}
    >
      <Paper 
        elevation={0}
        sx={{ 
          maxWidth: 600,
          width: '100%',
          mx: 2,
          p: 4,
          bgcolor: '#161b22',
          border: '1px solid #30363d',
          borderRadius: 2
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            color: '#c9d1d9',
            textAlign: 'center',
            mb: 4
          }}
        >
          Register
        </Typography>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
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
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleChange}
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
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange}
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
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
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
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
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
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="institution"
                label="Institution"
                value={formData.institution}
                onChange={handleChange}
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
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="department"
                label="Department"
                value={formData.department}
                onChange={handleChange}
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
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                name="researchInterests"
                label="Research Interests"
                value={formData.researchInterests}
                onChange={handleChange}
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
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 4,
              mb: 2,
              bgcolor: '#238636',
              '&:hover': {
                bgcolor: '#2ea043'
              },
              '&.Mui-disabled': {
                bgcolor: '#238636',
                opacity: 0.7
              }
            }}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>

          <Typography 
            variant="body2" 
            align="center"
            sx={{ color: '#8b949e' }}
          >
            Already have an account?{' '}
            <Button
              onClick={() => navigate('/auth/login')}
              sx={{
                color: '#58a6ff',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: 'transparent',
                  textDecoration: 'underline'
                }
              }}
            >
              Sign In
            </Button>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
} 