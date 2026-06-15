import { Box, Typography, TextField, InputAdornment, CircularProgress, Alert, Skeleton, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import { UnifiedBeer } from '../../interfaces/base';
import BeerSearchTable from './BeerSearchTable';

interface BeerSearchPanelProps {
  query: string;
  onQueryChange: (value: string) => void;
  results: UnifiedBeer[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  listIds: Set<string | number>;
  onAdd: (beer: UnifiedBeer) => void;
  onViewDetail: (beer: UnifiedBeer) => void;
  selectedStyle: string;
  onStyleSelect: (style: string) => void;
  availableStyles: string[];
}

/** Placeholder skeleton row shown while results are loading. */
function BeerCardSkeleton() {
  return (
    <Box
      sx={{
        display: 'flex',
        mb: 1.5,
        background: 'rgba(255,255,255,0.06)',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Skeleton variant="rectangular" width={72} height={100} sx={{ flexShrink: 0 }} />
      <Box sx={{ flex: 1, p: 1.5 }}>
        <Skeleton width="60%" height={20} />
        <Skeleton width="80%" height={16} sx={{ mt: 0.5 }} />
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <Skeleton variant="rounded" width={56} height={24} />
          <Skeleton variant="rounded" width={56} height={24} />
        </Box>
      </Box>
    </Box>
  );
}

/**
 * Left panel of the My Beers page.
 * Contains the search field, loading skeletons, error state,
 * empty state, and the list of BeerResultCard results.
 */
export default function BeerSearchPanel({
  query,
  onQueryChange,
  results,
  status,
  error,
  listIds,
  onAdd,
  onViewDetail,
  selectedStyle,
  onStyleSelect,
  availableStyles,
}: BeerSearchPanelProps) {
  return (
    <Box>
      {/* Search input */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search beers… (e.g. IPA, Stout, Punk)"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: '#C96E12' }} />
            </InputAdornment>
          ),
          endAdornment:
            status === 'loading' ? (
              <InputAdornment position="end">
                <CircularProgress size={20} sx={{ color: '#C96E12' }} />
              </InputAdornment>
            ) : null,
        }}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            background: '#fff',
            color: '#1a1a1a',
            borderRadius: 2,
            '& fieldset': { borderColor: 'rgba(0,0,0,0.2)' },
            '&:hover fieldset': { borderColor: '#C96E12' },
            '&.Mui-focused fieldset': { borderColor: '#C96E12' },
          },
          '& input::placeholder': { color: 'rgba(0,0,0,0.35)' },
        }}
      />

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error} — the Punk API may be temporarily unavailable.
        </Alert>
      )}

      {/* Style Filters */}
      {availableStyles.length > 0 && (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          <Chip
            label="All Styles"
            onClick={() => onStyleSelect('All')}
            sx={{
              background: selectedStyle === 'All' ? '#C96E12' : 'rgba(0,0,0,0.06)',
              color: selectedStyle === 'All' ? '#fff' : '#1a1a1a',
              fontWeight: selectedStyle === 'All' ? 700 : 500,
              '&:hover': { background: selectedStyle === 'All' ? '#a85a0e' : 'rgba(0,0,0,0.1)' },
            }}
          />
          {availableStyles.map((style) => (
            <Chip
              key={style}
              label={style}
              onClick={() => onStyleSelect(style)}
              sx={{
                background: selectedStyle === style ? '#C96E12' : 'rgba(0,0,0,0.06)',
                color: selectedStyle === style ? '#fff' : '#1a1a1a',
                fontWeight: selectedStyle === style ? 700 : 500,
                '&:hover': { background: selectedStyle === style ? '#a85a0e' : 'rgba(0,0,0,0.1)' },
              }}
            />
          ))}
        </Box>
      )}

      {/* Result count */}
      <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.45)', mb: 1.5 }}>
        {status === 'succeeded'
          ? `${results.length} beer${results.length !== 1 ? 's' : ''} found`
          : '\u00a0'}
      </Typography>

      {/* Skeletons while loading */}
      {status === 'loading' &&
        Array.from({ length: 6 }).map((_, i) => <BeerCardSkeleton key={i} />)}

      {/* Empty state */}
      {status === 'succeeded' && results.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 6, color: 'rgba(0,0,0,0.3)' }}>
          <SportsBarIcon sx={{ fontSize: 56, mb: 1 }} />
          <Typography>No beers found — try a different search</Typography>
        </Box>
      )}

      {/* Results */}
      {status === 'succeeded' && results.length > 0 && (
        <BeerSearchTable
          searchResults={results}
          onAdd={onAdd}
          onViewDetail={onViewDetail}
        />
      )}
    </Box>
  );
}
