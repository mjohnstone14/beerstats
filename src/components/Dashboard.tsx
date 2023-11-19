import React, { useEffect } from 'react';
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
import BeerBackground from '../assets/tasty-american-beer-composition.jpg';
import BeerMug from '../assets/beer-android-chrome-192x192.png';
import AnnouncementIcon from '@mui/icons-material/Announcement'; 
import { Card } from '@mui/material';

export default function Dashboard() {
  const navigate = useNavigate();
  const currentBeers = useAppSelector((state) => state.beers.value);
  const currentData = useAppSelector((state) => state.beers.data);
  const status = useAppSelector((state) => state.beers.status);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (currentBeers === 0) {
      navigate('/');
    }
    console.log(currentData, status);
  }, [status, currentData]);

  function navigateHome() {
    dispatch(clearBeerData());
    navigate('/');
  }

  const trigger = useScrollTrigger({
    target: window,
  });

  return (
    <React.Fragment>
      <CssBaseline />
      <Slide appear={false} direction="down" in={!trigger}>
        <AppBar>
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
      <Container>
        <Box sx={{ my: 2 }}>
          <Card style={{ margin: '3%' }}>
            <Typography>Disclaimer: The data is currently provided by <a href="https://random-data-api.com/" target="_blank" rel="noopener noreferrer">Random Data API</a> and does not represent real data</Typography>
          </Card>
          <BeerTable />
        </Box>
      </Container>
      {/* Set background image on body */}
      <style>
        {`
          body {
            background-image: url(${BeerBackground});
            background-size: cover;
            background-position: center;
            margin: 0; /* Remove default body margin */
            padding: 0; /* Remove default body padding */
            height: 100vh; /* Set body height to cover the whole viewport */
          }
        `}
      </style>
    </React.Fragment>
  );
}