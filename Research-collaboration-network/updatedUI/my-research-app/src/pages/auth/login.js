import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
} from '@mui/material';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setError('');
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Check for admin credentials
      if (formData.email === 'admin' && formData.password === 'rvce@dbms') {
        localStorage.setItem('token', 'admin-token');
        localStorage.setItem('userRole', 'admin');
        router.push('/dashboard');
        return;
      }

      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', 'user');
        router.push('/dashboard');
      } else {
        if (data.error === 'User not found') {
          setError('User not registered. Please sign up first.');
          setTimeout(() => {
            router.push('/auth/register');
          }, 2000);
        } else if (data.error === 'Invalid password') {
          setError('Invalid password. Please try again.');
        } else {
          setError(data.error || 'Login failed');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please check your connection.');
    }
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
            Login
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
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              sx={{
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
                marginBottom: 2,
                '& .MuiInputBase-root.Mui-focused': {
                  backgroundColor: '#000000',
                },
                '& .MuiInputBase-root:hover': {
                  backgroundColor: '#000000',
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              sx={{
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
                marginBottom: 2,
                '& .MuiInputBase-root.Mui-focused': {
                  backgroundColor: '#000000',
                },
                '& .MuiInputBase-root:hover': {
                  backgroundColor: '#000000',
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
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
              }}
            >
              Sign In
            </Button>
          </Box>

          <Button
            onClick={() => router.push('/auth/register')}
            sx={{
              color: '#3fb950',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'underline',
              },
            }}
          >
            Don&apos;t have an account? Sign Up
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

