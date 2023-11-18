import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Slide from '@mui/material/Slide';
import beerMug from '../assets/beer-android-chrome-192x192.png'
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useEffect } from 'react';
import { clearBeerData } from '../features/beerSlice';

interface BeerObject {
    alcohol: string,
    blg: string,
    brand: string,
    hop: string,
    ibu: string,
    id: Number,
    malts: string,
    name: string,
    style: string,
    uid: string,
    yeast: string
}

export default function Dashboard() {
  let navigate = useNavigate();
  const currentBeers = useAppSelector(state => state.beers.value)
  const currentData: Array<BeerObject> = useAppSelector(state => state.beers.data)
  const status = useAppSelector(state => state.beers.status)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if(currentBeers === 0) {
        navigate('/')
    }
    console.log(currentData, status)
  }, [status, currentData])

  function navigateHome() {
    dispatch(clearBeerData())
    navigate('/');
  }

  const trigger = useScrollTrigger({
    target: window,
  });

  function brands() : JSX.Element[] {
    const brandTypography : Array<JSX.Element> = []
    currentData.forEach((beer : BeerObject) => {
        brandTypography.push(<Typography key={beer.brand + beer.alcohol + beer.ibu}>{beer.brand + " " + beer.name}</Typography>)
    })
    return brandTypography
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Slide appear={false} direction="down" in={!trigger}>
        <AppBar>
          <Toolbar>
            <img src={beerMug} onClick={navigateHome} className="toolbar-logo" alt="Beer logo" />
            <Typography variant="h6" component="div">
              Analytics on your requested {currentBeers} brews
            </Typography>
          </Toolbar>
        </AppBar>
      </Slide>
      <Toolbar />
      <Container>
        <Box sx={{ my: 2 }}>
          {brands()}
        </Box>
      </Container>
    </React.Fragment>
  );
}
