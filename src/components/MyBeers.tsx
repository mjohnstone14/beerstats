import { useState, useCallback, useEffect, useRef } from 'react';
import { AppBar, Toolbar, Typography, Container, Box, Tooltip } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  searchPunkBeers,
  addToMyList,
  removeFromMyList,
  clearMyList,
  setSelectedBeerId,
  clearSearch,
  punkBeerToBeerObject,
  getBeerStyle,
} from '../features/myBeersSlice';
import { setBeerAmount, clearBeerData } from '../features/beerSlice';
import { PunkBeer } from '../interfaces/base';
import BeerMug from '../assets/beer-android-chrome-192x192.png';
import BeerSearchPanel from './mybeers/BeerSearchPanel';
import MyBeersList from './mybeers/MyBeersList';

const theme = createTheme({
  palette: {
    background: { default: '#ffffff' },
    primary: { main: '#C96E12' },
  },
  typography: { fontFamily: '"Inter", "Roboto", sans-serif' },
});

/**
 * My Beers page — orchestrates the search panel and personal list panel.
 * All Redux interaction lives here; child components are purely presentational.
 */
export default function MyBeers() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { searchResults, myList, searchStatus, error } = useAppSelector(
    (state) => state.myBeers
  );

  const [query, setQuery] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('All');
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listIds = new Set(myList.map((b) => b.id));

  // Compute available styles and filtered results
  const availableStyles = Array.from(
    new Set(searchResults.map((b) => getBeerStyle(b)))
  ).sort();

  const filteredResults =
    selectedStyle === 'All'
      ? searchResults
      : searchResults.filter((b) => getBeerStyle(b) === selectedStyle);

  // Load initial browse results on mount, clean up on unmount
  useEffect(() => {
    dispatch(searchPunkBeers(''));
    return () => { dispatch(clearSearch()); };
  }, [dispatch]);

  const handleQueryChange = useCallback(
    (value: string) => {
      setQuery(value);
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        dispatch(searchPunkBeers(value));
      }, 400);
    },
    [dispatch]
  );

  const handleAdd = (beer: PunkBeer) => dispatch(addToMyList(beer));
  const handleRemove = (id: number) => dispatch(removeFromMyList(id));
  const handleClear = () => dispatch(clearMyList());

  const handleViewDetail = (beer: PunkBeer) => {
    dispatch(setSelectedBeerId(beer.id));
    navigate(`/beer/${beer.id}`);
  };

  /** Map the personal list into BeerObject[], push to the existing beerSlice, go to dashboard. */
  const handleViewAnalytics = () => {
    if (myList.length < 2) return;
    const mapped = myList.map(punkBeerToBeerObject);
    dispatch(clearBeerData());
    dispatch(setBeerAmount(mapped.length));
    dispatch({ type: 'data/fetchBeerData/fulfilled', payload: mapped });
    navigate('/dashboard');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AppBar position="sticky" sx={{ background: 'linear-gradient(90deg,#C96E12,#a85a0e)' }}>
        <Toolbar>
          <img
            src={BeerMug}
            onClick={() => navigate('/')}
            style={{ width: 40, height: 40, cursor: 'pointer', marginRight: 12 }}
            alt="Home"
          />
          <SportsBarIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, flexGrow: 1 }}>
            My Beers
          </Typography>
          <Tooltip title="Search 325 real craft beers from BrewDog's DIY Dog catalogue">
            <InfoOutlinedIcon sx={{ opacity: 0.8, cursor: 'help' }} />
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 380px' },
            gap: 3,
            alignItems: 'start',
          }}
        >
          <BeerSearchPanel
            query={query}
            onQueryChange={handleQueryChange}
            results={filteredResults}
            status={searchStatus}
            error={error}
            listIds={listIds}
            onAdd={handleAdd}
            onViewDetail={handleViewDetail}
            selectedStyle={selectedStyle}
            onStyleSelect={setSelectedStyle}
            availableStyles={availableStyles}
          />

          <MyBeersList
            list={myList}
            onRemove={handleRemove}
            onClear={handleClear}
            onViewDetail={handleViewDetail}
            onViewAnalytics={handleViewAnalytics}
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
}
