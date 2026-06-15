import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import { PunkBeer } from '../../interfaces/base';
import { getBeerStyle } from '../../features/myBeersSlice';

const PUNK_IMAGE_BASE = 'https://punkapi-alxiw.amvera.io/v3/images';

function getBeerImageUrl(image: string | null): string {
  if (!image) return '';
  if (image.startsWith('http')) return image;
  return `${PUNK_IMAGE_BASE}/${image}`;
}

interface BeerResultCardProps {
  beer: PunkBeer;
  added: boolean;
  onAdd: (beer: PunkBeer) => void;
  onViewDetail: (beer: PunkBeer) => void;
}

/**
 * A single beer card shown in the search results panel.
 * Displays the label image, name, tagline, ABV/IBU chips,
 * and an add button that becomes disabled once the beer is in the list.
 */
export default function BeerResultCard({
  beer,
  added,
  onAdd,
  onViewDetail,
}: BeerResultCardProps) {
  return (
    <Card
      sx={{
        display: 'flex',
        mb: 1.5,
        background: added ? 'rgba(201,110,18,0.08)' : '#fff',
        border: added
          ? '1px solid rgba(201,110,18,0.4)'
          : '1px solid rgba(0,0,0,0.1)',
        borderRadius: 2,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        transition: 'all 0.2s ease',
        '&:hover': {
          background: added ? 'rgba(201,110,18,0.12)' : '#fafafa',
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        },
      }}
    >
      {/* Label image */}
      <Box
        sx={{
          width: 72,
          flexShrink: 0,
          background: 'rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px 0 0 8px',
          overflow: 'hidden',
        }}
      >
        {beer.image ? (
          <CardMedia
            component="img"
            image={getBeerImageUrl(beer.image)}
            alt={beer.name}
            sx={{ height: 90, objectFit: 'contain', p: 1 }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <SportsBarIcon sx={{ fontSize: 32, color: 'rgba(255,255,255,0.2)' }} />
        )}
      </Box>

      {/* Text content */}
      <CardContent
        sx={{ flex: 1, py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            color: '#1a1a1a',
            fontWeight: 700,
            lineHeight: 1.2,
            mb: 0.25,
            cursor: 'pointer',
            '&:hover': { color: '#C96E12' },
          }}
          onClick={() => onViewDetail(beer)}
        >
          {beer.name}
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: 'rgba(0,0,0,0.45)', display: 'block', mb: 1 }}
        >
          {beer.tagline}
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
          <Chip
            label={getBeerStyle(beer)}
            size="small"
            sx={{
              background: 'rgba(0,0,0,0.06)',
              color: '#1a1a1a',
              fontSize: '0.7rem',
              height: 22,
              fontWeight: 600,
            }}
          />
          <Chip
            label={`ABV ${beer.abv}%`}
            size="small"
            sx={{
              background: 'rgba(201,110,18,0.3)',
              color: '#f5a623',
              fontSize: '0.7rem',
              height: 22,
            }}
          />
          {beer.ibu != null && (
            <Chip
              label={`IBU ${beer.ibu}`}
              size="small"
              sx={{
                background: 'rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.7rem',
                height: 22,
              }}
            />
          )}
        </Box>
      </CardContent>

      {/* Add button */}
      <CardActions sx={{ pr: 1.5, flexShrink: 0, alignItems: 'center' }}>
        <Tooltip title={added ? 'Already in your list' : 'Add to My Beers'}>
          <span>
            <IconButton
              size="small"
              disabled={added}
              onClick={() => onAdd(beer)}
              sx={{
                background: added
                  ? 'rgba(201,110,18,0.2)'
                  : 'rgba(201,110,18,0.15)',
                color: added ? 'rgba(201,110,18,0.5)' : '#C96E12',
                '&:hover': { background: 'rgba(201,110,18,0.3)' },
              }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </CardActions>
    </Card>
  );
}
