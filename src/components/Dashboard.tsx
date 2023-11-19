import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Slide from '@mui/material/Slide';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { clearBeerData } from '../features/beerSlice';
import BeerTable from './BeerTable';
import BeerMug from '../assets/beer-android-chrome-192x192.png';
import { Card, ThemeProvider, createTheme } from '@mui/material';
import ABVChart from './ABVChart';
import IBUDoughnut from './IBUDoughnut';

const theme = createTheme({
  palette: {
    background: {
      default: '#EC9D00', 
    },
  },
});

/**
 * Main dashboard where the charts, tables, and graphs will live
 * 
 * @returns a JSX element that represents a dashboard of graphs
 */
export default function Dashboard() {
  const navigate = useNavigate();
  const currentBeers = useAppSelector((state) => state.beers.value);
  const dispatch = useAppDispatch();

  // Handle navigation when user clicks on mug home button, clears data
  function navigateHome() {
    dispatch(clearBeerData());
    navigate('/');
  }

  const trigger = useScrollTrigger({
    target: window,
  });

  return (
    <ThemeProvider theme={theme}>
      <React.Fragment>
        <CssBaseline />
        <Slide appear={false} direction="down" in={!trigger}>
          <AppBar sx={{ backgroundColor: '#C96E12' }}>
            <Toolbar>
              <img
                src={BeerMug}
                onClick={navigateHome}
                className="toolbar-logo"
                alt="Beer logo"
              />
              <Typography variant="h6" component="div">
                Analytics on your requested {currentBeers} brews
              </Typography>
            </Toolbar>
          </AppBar>
        </Slide>
        <Toolbar />
        <Container style={{ height: 'auto' }}>
          <Box sx={{ my: 2 }}>
            <Card style={{ margin: '3%' }}>
              <Typography>Disclaimer: The data is currently provided by <a href="https://random-data-api.com/" target="_blank" rel="noopener noreferrer">Random Data API</a> and does not represent real data</Typography>
            </Card>
            <BeerTable />
            <ABVChart />
            <IBUDoughnut/>
          </Box>
        </Container>
      </React.Fragment>
    </ThemeProvider>
  );
}