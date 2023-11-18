import { useState } from 'react'
import beer from '../assets/beer-android-chrome-512x512.png'
import '../App.css'
import { InputAdornment, TextField } from '@mui/material'
import { useAppSelector, useAppDispatch } from '../hooks'
import { clearBeerData, fetchBeerData, getBeerByAmount, setBeerAmount } from '../features/beerSlice'
import { useNavigate } from 'react-router-dom'

function App() {
  const [numError, setNumError] = useState(false)
  const [errorText, setErrorText] = useState('')
  let navigate = useNavigate()
  const currentBeers = useAppSelector(state => state.beers.value)
  const dispatch = useAppDispatch()

  const dispatchBeers = () => {
    if(!numError) {
      dispatch(getBeerByAmount(currentBeers))
      dispatch(fetchBeerData(currentBeers)) 
      navigate('/dashboard')
    }  
  }

  /**
   * Determine if user provided a number
   * instead of a string, then set an
   * error message to indicate this
   * 
   * @param value string user input event
   */
  const handleNumberChange = (value: string) => {  
    const numBeers = Number(value)
    
    if(Number.isNaN(numBeers)) {
      setNumError(true)
      setErrorText('Sorry pal, numbers only')
    } else if (numBeers > 100) {
      setNumError(true)
      setErrorText('Slow down friend, I can only carry a hundred at most!')
    } else {
      setNumError(false)
      setErrorText('')
      dispatch(clearBeerData())
      dispatch(setBeerAmount(numBeers))
    }
  };

  return (
    <>
      <h1>Welcome friend, to Beer Stats!</h1>
      <h2>To begin, specify your desired amount and then press the mug.</h2>
      <div className="card">
        <TextField
          label="What can I get ya?"
          InputProps={{
            endAdornment: <InputAdornment position="end">beers</InputAdornment>,
          }}
          onChange={(e) => handleNumberChange(e.target.value)}
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
  )
}

export default App
