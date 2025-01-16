import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link as MuiLink,
  MenuItem,
  Paper,
  Alert,
} from '@mui/material';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    designation: '',
    institution: '',
    department: '',
    researchInterests: '',
  });
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const designations = [
    'student',
    'assistant_professor',
    'associate_professor',
    'senior_professor',
  ];

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (password.length < minLength) {
      return 'Password must be at least 8 characters long';
    }
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!hasSymbol) {
      return 'Password must contain at least one special character';
    }
    return '';
  };

  const handleChange = (e) => {
    setError('');
    const { name, value } = e.target;
    
    if (name === 'password') {
      const validationError = validatePassword(value);
      setPasswordError(validationError);
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Final password validation before submission
    const passwordValidation = validatePassword(formData.password);
    if (passwordValidation) {
      setPasswordError(passwordValidation);
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        researchInterests: formData.researchInterests.split(',').map(item => item.trim()),
      };

      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (response.ok) {
        // Show success message and redirect to login
        setError('Registration successful! Redirecting to login...');
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        if (data.error.includes('duplicate')) {
          setError('Email already registered. Please login instead.');
          setTimeout(() => {
            router.push('/auth/login');
          }, 2000);
        } else {
          setError(data.error || 'Registration failed');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Network error. Please check your connection.');
    }
  };

  const textFieldStyle = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#0d1117',
      '& fieldset': {
        borderColor: '#30363d',
      },
      '&:hover fieldset': {
        borderColor: '#3fb950',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#3fb950',
      },
      '&.Mui-focused': {
        backgroundColor: '#000000',
      },
      '&:hover': {
        backgroundColor: '#000000',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#8b949e',
      backgroundColor: '#161b22',
      padding: '0 8px',
      marginLeft: '-4px',
    },
    '& .MuiOutlinedInput-input': {
      color: '#ffffff',
      '&::placeholder': {
        color: '#8b949e',
        opacity: 1,
      },
    },
    '& .MuiSelect-icon': {
      color: '#8b949e',
    },
    '& .MuiSelect-select': {
      backgroundColor: '#000000',
    },
    '& .MuiMenu-paper': {
      backgroundColor: '#161b22',
    },
    marginBottom: 2,
    '& .MuiInputBase-root.Mui-focused': {
      backgroundColor: '#000000',
    },
    '& .MuiInputBase-root:hover': {
      backgroundColor: '#000000',
    },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#0d1117',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
      }}
    >
      <Paper
        elevation={24}
        sx={{
          maxWidth: 'sm',
          width: '100%',
          backgroundColor: '#161b22',
          borderRadius: 2,
          border: '1px solid #30363d',
          padding: 4,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ 
              color: '#3fb950',
              fontWeight: 600,
              textShadow: '0 0 10px rgba(63, 185, 80, 0.3)',
            }}
          >
            Register
          </Typography>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                width: '100%',
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                color: '#ff6b6b',
                border: '1px solid rgba(220, 38, 38, 0.2)',
                '& .MuiAlert-icon': {
                  color: '#ff6b6b',
                },
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="firstName"
              label="First Name"
              autoFocus
              value={formData.firstName}
              onChange={handleChange}
              sx={textFieldStyle}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="lastName"
              label="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              sx={textFieldStyle}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange}
              sx={textFieldStyle}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={!!passwordError}
              helperText={passwordError}
              sx={{
                ...textFieldStyle,
                '& .MuiFormHelperText-root': {
                  color: '#ff6b6b',
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              select
              name="designation"
              label="Designation"
              value={formData.designation}
              onChange={handleChange}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: {
                      backgroundColor: '#161b22',
                      border: '1px solid #30363d',
                      '& .MuiMenuItem-root': {
                        color: '#c9d1d9',
                        '&:hover': {
                          backgroundColor: '#1f242c',
                        },
                        '&.Mui-selected': {
                          backgroundColor: '#1f242c',
                          '&:hover': {
                            backgroundColor: '#2b3139',
                          },
                        },
                      },
                    },
                  },
                },
              }}
              sx={textFieldStyle}
            >
              {designations.map((option) => (
                <MenuItem 
                  key={option} 
                  value={option}
                  sx={{ 
                    color: '#c9d1d9',
                    '&:hover': {
                      backgroundColor: '#1f242c',
                    },
                  }}
                >
                  {option.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="normal"
              required
              fullWidth
              name="institution"
              label="Institution"
              value={formData.institution}
              onChange={handleChange}
              sx={textFieldStyle}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="department"
              label="Department"
              value={formData.department}
              onChange={handleChange}
              sx={textFieldStyle}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="researchInterests"
              label="Research Interests (comma-separated)"
              value={formData.researchInterests}
              onChange={handleChange}
              helperText="Enter your research interests separated by commas"
              sx={{
                ...textFieldStyle,
                '& .MuiFormHelperText-root': {
                  color: '#8b949e',
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={!!passwordError}
              sx={{
                mt: 3,
                mb: 2,
                bgcolor: '#3fb950',
                '&:hover': {
                  bgcolor: '#2ea043',
                },
                textTransform: 'none',
                fontSize: '1rem',
                py: 1.5,
                boxShadow: '0 0 10px rgba(63, 185, 80, 0.3)',
                '&.Mui-disabled': {
                  bgcolor: '#2c3a41',
                  color: '#8b949e',
                },
              }}
            >
              Register
            </Button>
          </Box>

          <Button
            onClick={() => router.push('/auth/login')}
            sx={{
              color: '#3fb950',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'underline',
              },
            }}
          >
            Already have an account? Sign In
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
