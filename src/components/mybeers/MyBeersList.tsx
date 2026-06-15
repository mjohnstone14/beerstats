import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Divider,
  Button,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import BarChartIcon from '@mui/icons-material/BarChart';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import { PunkBeer } from '../../interfaces/base';

interface MyBeersListProps {
  list: PunkBeer[];
  onRemove: (id: number) => void;
  onClear: () => void;
  onViewDetail: (beer: PunkBeer) => void;
  onViewAnalytics: () => void;
}

/**
 * Right-panel sticky sidebar showing the user's personal beer selection.
 * Handles remove-per-item, clear-all, and the View Analytics CTA.
 */
export default function MyBeersList({
  list,
  onRemove,
  onClear,
  onViewDetail,
  onViewAnalytics,
}: MyBeersListProps) {
  return (
    <Box
      sx={{
        position: { md: 'sticky' },
        top: { md: 80 },
        background: '#fff',
        border: '1px solid rgba(0,0,0,0.1)',
        borderRadius: 3,
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        p: 2.5,
        minHeight: 300,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ color: '#1a1a1a', fontWeight: 700 }}>
          My List
          {list.length > 0 && (
            <Chip
              label={list.length}
              size="small"
              sx={{
                ml: 1,
                background: '#C96E12',
                color: '#fff',
                fontWeight: 700,
                height: 22,
                fontSize: '0.75rem',
              }}
            />
          )}
        </Typography>

        {list.length > 0 && (
          <Tooltip title="Clear all">
            <IconButton
              size="small"
              onClick={onClear}
              sx={{ color: 'rgba(0,0,0,0.35)' }}
            >
              <DeleteSweepIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Empty state */}
      {list.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4, color: 'rgba(0,0,0,0.3)' }}>
          <SportsBarIcon sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="body2">
            Add beers from the search results to build your list
          </Typography>
        </Box>
      ) : (
        <>
          {/* Beer rows */}
          <Box sx={{ maxHeight: '50vh', overflowY: 'auto', mb: 2 }}>
            {list.map((beer, index) => (
              <React.Fragment key={beer.id}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 1,
                  }}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#1a1a1a',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        cursor: 'pointer',
                        '&:hover': { color: '#C96E12' },
                      }}
                      onClick={() => onViewDetail(beer)}
                    >
                      {beer.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: 'rgba(0,0,0,0.45)' }}
                    >
                      ABV {beer.abv}%
                      {beer.ibu != null ? ` · IBU ${beer.ibu}` : ''}
                    </Typography>
                  </Box>

                  <IconButton
                    size="small"
                    onClick={() => onRemove(beer.id)}
                    sx={{
                      color: 'rgba(0,0,0,0.3)',
                      ml: 1,
                      '&:hover': { color: '#e53935' },
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>

                {index < list.length - 1 && (
                  <Divider sx={{ borderColor: 'rgba(0,0,0,0.07)' }} />
                )}
              </React.Fragment>
            ))}
          </Box>

          {/* CTA */}
          <Tooltip
            title={
              list.length < 2 ? 'Add at least 2 beers to view analytics' : ''
            }
          >
            <span style={{ display: 'block' }}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                disabled={list.length < 2}
                startIcon={<BarChartIcon />}
                onClick={onViewAnalytics}
                sx={{
                  background: 'linear-gradient(135deg,#C96E12,#e88c2a)',
                  fontWeight: 700,
                  borderRadius: 2,
                  py: 1.25,
                  '&:hover': {
                    background: 'linear-gradient(135deg,#a85a0e,#C96E12)',
                  },
                  '&:disabled': {
                    background: 'rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.3)',
                  },
                }}
              >
                View Analytics →
              </Button>
            </span>
          </Tooltip>
        </>
      )}
    </Box>
  );
}
