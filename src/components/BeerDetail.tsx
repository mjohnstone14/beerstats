import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Card,
  CardMedia,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAppDispatch, useAppSelector } from '../hooks';
import { loadBeerById, addToMyList } from '../features/myBeersSlice';
import BeerMug from '../assets/beer-android-chrome-192x192.png';

const theme = createTheme({
  palette: {
    background: { default: '#ffffff' },
    primary: { main: '#C96E12' },
  },
  typography: { fontFamily: '"Inter", "Roboto", sans-serif' },
});

/**
 * Renders a labelled stat box for the beer detail stats row.
 */
function StatBox({ label, value }: { label: string; value: string | number | null }) {
  if (value == null) return null;
  return (
    <Box
      sx={{
        background: '#fff',
        border: '1px solid rgba(0,0,0,0.1)',
        borderRadius: 2,
        px: 2.5,
        py: 1.5,
        textAlign: 'center',
        minWidth: 80,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}
    >
      <Typography variant="h6" sx={{ color: '#C96E12', fontWeight: 700 }}>
        {value}
      </Typography>
      <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.5)', textTransform: 'uppercase', letterSpacing: 1 }}>
        {label}
      </Typography>
    </Box>
  );
}

/**
 * Beer Detail page — shows extended information for a single Punk API beer.
 * Navigated to from My Beers when the user clicks on a beer name/card.
 */
export default function BeerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { searchResults, myList, detailStatus, error } = useAppSelector(
    (state) => state.myBeers
  );

  const beerId = id; // string to handle "craft-10"

  // Try to find the beer in already-loaded search results first, then fall back to API call
  const beer =
    searchResults.find((b) => String(b.id) === beerId) ??
    myList.find((b) => String(b.id) === beerId) ??
    null;

  const isInList = myList.some((b) => String(b.id) === beerId);

  useEffect(() => {
    if (!beer && beerId) {
      dispatch(loadBeerById(beerId));
    }
  }, [beer, beerId, dispatch]);

  // After loadBeerById fulfils, the beer will be available via searchResults
  // because we push it there in the thunk. But since we fetch a single beer
  // outside of search, we store it separately — for now re-use searchResults
  // populated by the thunk, or show loading.

  const handleAddToList = () => {
    if (beer) dispatch(addToMyList(beer));
  };

  const getBeerImageUrl = (image: string | null) => {
    if (!image) return '';
    if (image.startsWith('http')) return image;
    return `https://punkapi-alxiw.amvera.io/v3/images/${image}`;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* ── AppBar ─────────────────────────────────────────── */}
      <AppBar position="sticky" sx={{ background: 'linear-gradient(90deg,#C96E12,#a85a0e)' }}>
        <Toolbar>
          <img
            src={BeerMug}
            onClick={() => navigate('/')}
            style={{ width: 40, height: 40, cursor: 'pointer', marginRight: 12 }}
            alt="Home"
          />
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/my-beers')}
            sx={{ color: '#fff', textTransform: 'none', mr: 2 }}
          >
            My Beers
          </Button>
          <Typography variant="h6" sx={{ fontWeight: 700, flexGrow: 1, opacity: 0.9 }}>
            {beer?.name ?? 'Beer Detail'}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>

        {/* Loading state */}
        {detailStatus === 'loading' && !beer && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#C96E12' }} />
          </Box>
        )}

        {/* Error state */}
        {error && !beer && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Beer content */}
        {beer && (
          <Box>
            {/* ── Hero Card ───────────────────────────── */}
            <Card
              sx={{
                background: 'linear-gradient(135deg, rgba(201,110,18,0.08), #fff)',
                border: '1px solid rgba(201,110,18,0.2)',
                borderRadius: 3,
                overflow: 'hidden',
                mb: 3,
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, p: 3, gap: 3 }}>
                {/* Image */}
                <Box
                  sx={{
                    width: { xs: '100%', sm: 160 },
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0,0,0,0.05)',
                    borderRadius: 2,
                    minHeight: 200,
                  }}
                >
                  {beer.image ? (
                    <CardMedia
                      component="img"
                      image={getBeerImageUrl(beer.image)}
                      alt={beer.name}
                      sx={{ maxHeight: 220, width: 'auto', objectFit: 'contain', p: 1 }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <SportsBarIcon sx={{ fontSize: 80, color: 'rgba(0,0,0,0.1)' }} />
                  )}
                </Box>

                {/* Info */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" sx={{ color: '#1a1a1a', fontWeight: 800, mb: 0.5 }}>
                    {beer.name}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: '#C96E12', mb: 1, fontStyle: 'italic' }}>
                    {beer.brewery} {beer.tagline ? `— ${beer.tagline}` : ''}
                  </Typography>
                  {beer.first_brewed && (
                    <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.45)', display: 'block', mb: 2 }}>
                      First brewed: {beer.first_brewed}
                    </Typography>
                  )}
                  {beer.description && (
                    <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.7)', lineHeight: 1.7, mb: 2.5 }}>
                      {beer.description}
                    </Typography>
                  )}

                  <Button
                    variant={isInList ? 'outlined' : 'contained'}
                    startIcon={isInList ? <CheckIcon /> : <AddIcon />}
                    disabled={isInList}
                    onClick={handleAddToList}
                    sx={{
                      background: isInList ? 'transparent' : 'linear-gradient(135deg,#C96E12,#e88c2a)',
                      borderColor: isInList ? 'rgba(201,110,18,0.5)' : undefined,
                      color: isInList ? 'rgba(201,110,18,0.8)' : '#fff',
                      fontWeight: 700,
                      borderRadius: 2,
                      '&:hover': {
                        background: isInList ? 'rgba(201,110,18,0.1)' : 'linear-gradient(135deg,#a85a0e,#C96E12)',
                      },
                      '&:disabled': {
                        background: 'transparent',
                        borderColor: 'rgba(201,110,18,0.3)',
                        color: 'rgba(201,110,18,0.5)',
                      },
                    }}
                  >
                    {isInList ? 'Added to My List' : 'Add to My List'}
                  </Button>
                </Box>
              </Box>

              {/* Stats row */}
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 2,
                  px: 3,
                  pb: 3,
                }}
              >
                <StatBox label="ABV" value={`${beer.abv}%`} />
                <StatBox label="IBU" value={beer.ibu} />
                <StatBox label="EBC" value={beer.ebc} />
                <StatBox label="SRM" value={beer.srm} />
                <StatBox label="pH" value={beer.ph} />
              </Box>
            </Card>

            {/* ── Ingredients ────────────────────────── */}
            {beer.ingredients && (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
                  gap: 2,
                  mb: 3,
                }}
              >
                {/* Malts */}
                <Card sx={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="overline" sx={{ color: '#C96E12', letterSpacing: 2, fontWeight: 700 }}>
                      Malts
                    </Typography>
                    <List dense disablePadding>
                      {beer.ingredients.malt.map((m, i) => (
                        <ListItem key={i} disablePadding sx={{ py: 0.25 }}>
                          <ListItemText
                            primary={m.name}
                            secondary={`${m.amount.value} ${m.amount.unit}`}
                            primaryTypographyProps={{ color: '#333', fontSize: '0.85rem' }}
                            secondaryTypographyProps={{ color: 'rgba(0,0,0,0.5)', fontSize: '0.75rem' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Card>

                {/* Hops */}
                <Card sx={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="overline" sx={{ color: '#C96E12', letterSpacing: 2, fontWeight: 700 }}>
                      Hops
                    </Typography>
                    <List dense disablePadding>
                      {beer.ingredients.hops.map((h, i) => (
                        <ListItem key={i} disablePadding sx={{ py: 0.25 }}>
                          <ListItemText
                            primary={h.name}
                            secondary={`${h.amount.value}g · ${h.add} · ${h.attribute}`}
                            primaryTypographyProps={{ color: '#333', fontSize: '0.85rem' }}
                            secondaryTypographyProps={{ color: 'rgba(0,0,0,0.5)', fontSize: '0.75rem' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Card>

                {/* Yeast + food */}
                <Card sx={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="overline" sx={{ color: '#C96E12', letterSpacing: 2, fontWeight: 700 }}>
                      Yeast
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#1a1a1a', mb: 2 }}>
                      {beer.ingredients.yeast}
                    </Typography>

                    {beer.food_pairing && (
                      <>
                        <Divider sx={{ borderColor: 'rgba(0,0,0,0.08)', mb: 1.5 }} />
                        <Typography variant="overline" sx={{ color: '#C96E12', letterSpacing: 2, fontWeight: 700, display: 'block', mb: 1 }}>
                          Food Pairings
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                          {beer.food_pairing.map((food, i) => (
                            <Chip
                              key={i}
                              label={food}
                              size="small"
                              sx={{
                                background: 'rgba(201,110,18,0.08)',
                                color: 'rgba(0,0,0,0.7)',
                                fontSize: '0.72rem',
                                height: 'auto',
                                '& .MuiChip-label': { whiteSpace: 'normal', py: 0.5 },
                              }}
                            />
                          ))}
                        </Box>
                      </>
                    )}
                  </Box>
                </Card>
              </Box>
            )}

            {/* ── Brewer's Tips ──────────────────────── */}
            {beer.brewers_tips && (
              <Card
                sx={{
                  background: '#fff',
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: 2,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  p: 2.5,
                }}
              >
                <Typography variant="overline" sx={{ color: '#C96E12', letterSpacing: 2, fontWeight: 700 }}>
                  Brewer's Tips
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.65)', mt: 1, lineHeight: 1.7 }}>
                  {beer.brewers_tips}
                </Typography>
              </Card>
            )}
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
}
