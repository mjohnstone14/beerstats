import beer from '../assets/beer-android-chrome-512x512.png';
import '../App.css';
import { Button, Box } from '@mui/material';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks';

/**
 * The main entry point of the application
 * and the home page.
 */
function App() {
  const navigate = useNavigate();
  const myList = useAppSelector((state) => state.myBeers.myList);

  return (
    <>
      <h1>Welcome friend, to Beer Stats!</h1>
      <h2>Start by exploring and saving beers, then check out your personal analytics.</h2>
      
      <div>
        <img src={beer} className="logo" alt="Beer logo" />
      </div>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
        <Button
          variant="contained"
          startIcon={<SportsBarIcon />}
          onClick={() => navigate('/my-beers')}
          sx={{
            background: 'linear-gradient(135deg,#C96E12,#e88c2a)',
            color: '#fff',
            fontWeight: 700,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1.1rem',
            px: 4,
            py: 1.5,
            '&:hover': {
              background: 'linear-gradient(135deg,#a85a0e,#C96E12)',
            },
          }}
        >
          Browse Beers
        </Button>

        <Button
          variant="outlined"
          startIcon={<BarChartIcon />}
          onClick={() => navigate('/dashboard')}
          disabled={myList.length === 0}
          sx={{
            borderColor: '#C96E12',
            color: '#C96E12',
            fontWeight: 700,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1.1rem',
            px: 4,
            py: 1.5,
            '&:hover': {
              background: 'rgba(201,110,18,0.1)',
              borderColor: '#a85a0e',
            },
          }}
        >
          {myList.length > 0 ? `View Analytics (${myList.length})` : 'View Analytics (Add beers first)'}
        </Button>
      </Box>
    </>
  );
}

export default App;
