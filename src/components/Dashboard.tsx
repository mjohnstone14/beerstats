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
import { useAppSelector } from '../hooks';
import BeerTable from './BeerTable';
import BeerMug from '../assets/beer-android-chrome-192x192.png';
import { ThemeProvider, createTheme } from '@mui/material';
import ABVChart from './ABVChart';
import IBUDoughnut from './IBUDoughnut';
import ABVvsIBUScatter from './analytics/ABVvsIBUScatter';
import StyleDoughnut from './analytics/StyleDoughnut';
import TopHopsChart from './analytics/TopHopsChart';
import ColorSpectrumChart from './analytics/ColorSpectrumChart';

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
  const myList = useAppSelector((state) => state.myBeers.myList);
  const currentBeers = myList.length;

  function navigateHome() {
    navigate('/');
  }

  useEffect(() => {
    if(currentBeers === 0) {
      navigateHome();
    }
  }, [currentBeers, navigate])

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
                style={{ cursor: 'pointer' }}
              />
              <Typography variant="h6" component="div">
                Analytics on your {currentBeers} brews
              </Typography>
            </Toolbar>
          </AppBar>
        </Slide>
        <Toolbar />
        <Container style={{ height: 'auto', paddingBottom: '40px' }}>
          <Box sx={{ my: 2 }}>
            <BeerTable />
            
            <Box sx={{ mt: 4, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              {/* Charts */}
              <ABVChart />
              <IBUDoughnut />
              <ABVvsIBUScatter />
              <StyleDoughnut />
              <TopHopsChart />
              <ColorSpectrumChart />
            </Box>
          </Box>
        </Container>
      </React.Fragment>
    </ThemeProvider>
  );
}