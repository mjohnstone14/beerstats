import { useState } from 'react';
import beer from '../assets/beer-android-chrome-512x512.png';
import '../App.css';
import { InputAdornment, TextField } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../hooks';
import { clearBeerData, fetchBeerData, setBeerAmount } from '../features/beerSlice';
import { useNavigate } from 'react-router-dom';

/**
 * The main entry point of the application
 * and the home page. It takes a user's input
 * and triggers a dispatch to fetch requested data.
 */
function App() {
  const [numError, setNumError] = useState(false);
  const [dispatchAllowed, setDispatchAllowed] = useState(false);
  const [errorText, setErrorText] = useState('');
  const navigate = useNavigate();
  const currentBeers = useAppSelector((state) => state.beers.value);
  const dispatch = useAppDispatch();

  const dispatchBeers = () => {
    if (!numError && dispatchAllowed === true) {
      dispatch(fetchBeerData(currentBeers));
      navigate('/dashboard');
    }
  };

  /**
   * Determine if the user provided a number
   * instead of a string, then set an
   * error message to indicate this.
   *
   * @param value string user input event
   */
  const handleNumberChange = (value: string) => {
    const numBeers = Number(value);

    if (Number.isNaN(numBeers)) {
      setNumError(true);
      setErrorText('Sorry pal, numbers only');
    } else if (numBeers > 100) {
      setNumError(true);
      setErrorText('Slow down friend, I can only carry a hundred at most!');
    } else if (numBeers < 2) {
      setNumError(true);
      setErrorText('You need at least two beers to compare!');
    } else {
      setNumError(false);
      setErrorText('');
      setDispatchAllowed(true);
      dispatch(clearBeerData());
      dispatch(setBeerAmount(numBeers));
    }
  };

  return (
    <>
      <h1>Welcome friend, to Beer Stats!</h1>
      <h2>To begin, specify your desired amount and then press the mug (or press enter).</h2>
      <div className="card">
        <TextField
          label="What can I get ya?"
          InputProps={{
            endAdornment: <InputAdornment position="end">beers</InputAdornment>,
          }}
          onChange={(e) => handleNumberChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              dispatchBeers();
            }
          }}
          error={numError}
          helperText={errorText}
        />
      </div>
      <div>
        <a onClick={dispatchBeers} target="_blank">
          <img src={beer} className="logo" alt="Beer logo" />
        </a>
      </div>
    </>
  );
}

export default App;
