import { Box, Typography } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

export default function StatsCard({ title, value, trend, trendUp }) {
  return (
    <Box
      sx={{
        bgcolor: '#161b22',
        borderRadius: 2,
        p: 3,
        border: '1px solid #30363d',
        flex: 1,
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          borderColor: '#3fb950'
        }
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          color: '#8b949e',
          mb: 1,
          fontSize: '0.875rem'
        }}
      >
        {title}
      </Typography>

      <Typography
        variant="h4"
        sx={{
          color: '#ffffff',
          fontWeight: 600,
          mb: 1
        }}
      >
        {typeof value === 'number' ? value.toLocaleString() : value}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: trendUp ? '#3fb950' : '#f85149',
            bgcolor: trendUp ? 'rgba(63, 185, 80, 0.1)' : 'rgba(248, 81, 73, 0.1)',
            px: 1,
            py: 0.5,
            borderRadius: 1,
          }}
        >
          {trendUp ? (
            <TrendingUp sx={{ fontSize: '1rem' }} />
          ) : (
            <TrendingDown sx={{ fontSize: '1rem' }} />
          )}
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              ml: 0.5
            }}
          >
            {trend}
          </Typography>
        </Box>
        <Typography
          variant="caption"
          sx={{
            color: '#8b949e'
          }}
        >
          vs last month
        </Typography>
      </Box>
    </Box>
  );
} 