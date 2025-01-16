import { useRouter } from 'next/router';
import { Box, Button, Typography, keyframes } from '@mui/material';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const glowAnimation = keyframes`
  0% {
    text-shadow: 0 0 10px rgba(63, 185, 80, 0.3);
  }
  50% {
    text-shadow: 0 0 20px rgba(63, 185, 80, 0.5);
  }
  100% {
    text-shadow: 0 0 10px rgba(63, 185, 80, 0.3);
  }
`;

export default function Home() {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#0d1117',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
        padding: 3,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(63, 185, 80, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Typography
        variant="h2"
        component="h1"
        align="center"
        sx={{
          color: '#ffffff',
          fontWeight: 700,
          animation: `${fadeIn} 1s ease-out, ${glowAnimation} 3s infinite`,
          mb: 2,
          fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
          textAlign: 'center',
          maxWidth: '90%',
          background: 'linear-gradient(45deg, #3fb950 30%, #238636 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Research Collaboration Network
      </Typography>

      <Typography
        variant="h5"
        component="h2"
        align="center"
        sx={{
          color: '#8b949e',
          maxWidth: '600px',
          textAlign: 'center',
          animation: `${fadeIn} 1s ease-out 0.3s backwards`,
          mb: 4,
          px: 2,
        }}
      >
        Connect, Collaborate, and Innovate with Researchers Worldwide
      </Typography>

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          animation: `${fadeIn} 1s ease-out 0.6s backwards`,
        }}
      >
        <Button
          variant="contained"
          size="large"
          onClick={() => router.push('/auth/login')}
          sx={{
            bgcolor: '#3fb950',
            color: '#ffffff',
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 2,
            boxShadow: '0 0 10px rgba(63, 185, 80, 0.3)',
            '&:hover': {
              bgcolor: '#2ea043',
              boxShadow: '0 0 20px rgba(63, 185, 80, 0.5)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Login
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={() => router.push('/auth/register')}
          sx={{
            color: '#3fb950',
            borderColor: '#3fb950',
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 2,
            '&:hover': {
              borderColor: '#2ea043',
              backgroundColor: 'rgba(63, 185, 80, 0.1)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Sign Up
        </Button>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '100px',
          background: 'linear-gradient(to top, rgba(63, 185, 80, 0.1), transparent)',
          pointerEvents: 'none',
        }}
      />
    </Box>
  );
} 